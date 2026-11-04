package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamItemAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.AssetErpItemSync;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB18 icamItem을 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다(회사 28000 = ICAM 2018) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamItemAction.class, AssetErpItemSync.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamItemActionDbTest {

    @Autowired IcamItemAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    private static BatchReq req(String stdDate) {
        return new BatchReq("28000", "ZZ시험", null, stdDate, null, null, null, null, null);
    }

    private Map<String, Object> item(String isin) {
        return jdbc.queryForMap("select * from ast01_class_tree where ast01_company_id = 28000 and ast01_isin = ? and ast01_type_cd = 'IT' and ast01_class_tree_nm like '시뮬%' or ast01_company_id = 28000 and ast01_isin = ? and ast01_class_tree_nm = '예금' and ast01_asset_type = '2' order by ast01_class_tree_id desc limit 1", isin, isin);
    }

    @Test
    void 대분류_중분류_종목을_만들고_분류코드를_채운다() {
        assertThat(action.run(req("2026-11-03"))).isEqualTo("ITEM 작업완료..commit");

        // 주식: 대분류만(중분류 없음) 아래에 종목
        Map<String, Object> stock = item("KRSIM0000001");
        assertThat(stock.get("ast01_class_tree_nm")).isEqualTo("시뮬 삼성전자");
        assertThat(stock.get("ast01_item_l_class_cd")).isEqualTo("20");
        assertThat(stock.get("ast01_item_m_class_cd")).isEqualTo("2010");
        assertThat(stock.get("ast01_item_s_class_cd")).isEqualTo("201099");
        assertThat(stock.get("ast01_asset_type")).isEqualTo("2");
        assertThat(stock.get("ast01_icam_yn")).isEqualTo("true");
        Map<String, Object> folder = jdbc.queryForMap("select * from ast01_class_tree where ast01_class_tree_id = ?", stock.get("ast01_parent_tree_id"));
        assertThat(folder.get("ast01_class_tree_nm")).isEqualTo("시뮬 주식");
        assertThat(folder.get("ast01_type_cd")).isEqualTo("IC");
        assertThat(((Number) folder.get("ast01_parent_tree_id")).longValue()).isZero();
        // 대분류 하나에 주식 2종목이 같이 들어간다
        assertThat(jdbc.queryForObject("select count(*) from ast01_class_tree where ast01_parent_tree_id = ?", Integer.class, folder.get("ast01_class_tree_id"))).isEqualTo(2);

        // 채권: 대분류 → 중분류 → 종목
        Map<String, Object> bond = item("KRSIM0000003");
        assertThat(bond.get("ast01_item_m_class_cd")).isEqualTo("2040");
        Map<String, Object> mid = jdbc.queryForMap("select * from ast01_class_tree where ast01_class_tree_id = ?", bond.get("ast01_parent_tree_id"));
        assertThat(mid.get("ast01_class_tree_nm")).isEqualTo("시뮬 국채");
        assertThat(jdbc.queryForObject("select ast01_class_tree_nm from ast01_class_tree where ast01_class_tree_id = ?", String.class, mid.get("ast01_parent_tree_id"))).isEqualTo("시뮬 채권");

        // 예금(10101)은 보통예금, 부동산 H는 건물
        Map<String, Object> deposit = item("10101");
        assertThat(deposit.get("ast01_item_m_class_cd")).isEqualTo("1010");
        assertThat(deposit.get("ast01_item_s_class_cd")).isEqualTo("101003");
        Map<String, Object> building = item("KRSIM0000004");
        assertThat(building.get("ast01_item_l_class_cd")).isEqualTo("50");
        assertThat(building.get("ast01_item_m_class_cd")).isEqualTo("5020");
        assertThat(building.get("ast01_item_s_class_cd")).isEqualTo("502099");
    }

    @Test
    void 두번_돌려도_이미_있는_것은_만들지_않는다() {
        action.run(req("2026-11-03"));
        int count = jdbc.queryForObject("select count(*) from ast01_class_tree where ast01_company_id = 28000", Integer.class);

        action.run(req("2026-11-03"));

        assertThat(jdbc.queryForObject("select count(*) from ast01_class_tree where ast01_company_id = 28000", Integer.class)).isEqualTo(count);
    }

    @Test
    void 담당자_자동생성이면_기준일에_유효한_모든_부서를_담당부서로_지정한다() {
        jdbc.update("update sys01_company set sys01_ast_manager_auto_yn = 'true' where sys01_company_id = 28000");
        int orgs = jdbc.queryForObject("select count(*) from org01_code where org01_company_id = 28000 and date '2026-11-03' between org01_open_date and coalesce(org01_close_date, date '2026-11-03')", Integer.class);
        assertThat(orgs).isGreaterThan(0);   // 시험이 허공을 치지 않도록
        int before = jdbc.queryForObject("select count(*) from ast10_manager where ast10_company_id = 28000", Integer.class);

        action.run(req("2026-11-03"));

        // 종목 5개(IT)마다 부서 수만큼. 분류 폴더(IC)에는 만들지 않는다
        assertThat(jdbc.queryForObject("select count(*) from ast10_manager where ast10_company_id = 28000", Integer.class) - before).isEqualTo(5 * orgs);
    }

    @Test
    void 기준일_형식이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(req("2026/11/03"))).isInstanceOf(BusinessException.class);
    }
}
