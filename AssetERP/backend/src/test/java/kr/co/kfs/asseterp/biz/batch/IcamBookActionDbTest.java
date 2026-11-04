package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamBookAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB19 icamBook을 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다. 펀드(fnd01)·종목(ast01)·자문 코드는 시험 안에서 넣는다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamBookAction.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamBookActionDbTest {

    @Autowired IcamBookAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    @BeforeEach
    void seed() {
        jdbc.update("update sys01_company set sys01_icam_advis_company_cd = 'ZZ98' where sys01_company_id = 28000");
        fund("ZZBK01", "true");
        item("ZZBKITEM1", "ZZBK000001");
        item("ZZBKITEM2", "ZZBK000002");
    }

    private void fund(String code, String icamYn) {
        jdbc.update("insert into fnd01_fund_code (fnd01_fund_code_id, fnd01_fund_cd, fnd01_company_id, fnd01_icam_yn) values (f_create_seq(), ?, 28000, ?)", code, icamYn);
    }

    private void item(String isin, String treeCd) {
        jdbc.update("insert into ast01_class_tree (ast01_class_tree_id, ast01_company_id, ast01_class_tree_cd, ast01_class_tree_nm, ast01_parent_tree_id, ast01_seq, ast01_type_cd, ast01_isin, ast01_asset_type, ast01_icam_yn) "
                + "values (f_create_seq(), 28000, ?, ?, 0, 1, 'IT', ?, '2', 'true')", treeCd, "시험종목 " + isin, isin);
    }

    private static BatchReq req() {
        return new BatchReq("28000", "ZZ시험", null, "2026-11-03", null, null, null, null, null);
    }

    private int count(String table, String prefix) {
        return jdbc.queryForObject("select count(*) from " + table + " where " + prefix + "_company_id = 28000 and " + prefix + "_std_date = date '2026-11-03'", Integer.class);
    }

    @Test
    void 운용_펀드원장과_자문일임_원장을_넣는다() {
        assertThat(action.run(req())).isEqualTo("BOOK 작업완료..commit");

        assertThat(count("fnd10_book", "fnd10")).isEqualTo(2);
        var b = jdbc.queryForMap("select * from fnd10_book where fnd10_company_id = 28000 and fnd10_item_cd = 'ZZBKITEM2'");
        assertThat(b.get("fnd10_note")).isEqualTo("시뮬 SK하이닉스, 보통주");
        assertThat(((Number) b.get("fnd10_eval_pl_amt")).longValue()).isEqualTo(-100000L);
        assertThat(b.get("fnd10_detail_type")).isEqualTo("20261001000001");
        assertThat(b.get("fnd10_market_nm")).isEqualTo("코스닥");
        assertThat(b.get("fnd10_creater")).isEqualTo("ZZ시험");
        assertThat(jdbc.queryForObject("select fnd10_ast_class_tree_id from fnd10_book where fnd10_company_id = 28000 and fnd10_item_cd = 'ZZBKITEM2'", Long.class))
                .isEqualTo(jdbc.queryForObject("select ast01_class_tree_id from ast01_class_tree where ast01_company_id = 28000 and ast01_isin = 'ZZBKITEM2'", Long.class));

        assertThat(count("adv10_book", "adv10")).isEqualTo(2);
        var a = jdbc.queryForMap("select * from adv10_book where adv10_company_id = 28000 and adv10_item_cd = 'A005930'");
        assertThat(((Number) a.get("adv10_qty")).longValue()).isEqualTo(100L);
        assertThat(a.get("adv10_eval_amt")).isNull();     // AS-IS 별칭 오류 그대로: 평가금액은 항상 null (#214)
    }

    @Test
    void 다시_돌리면_그날_원장을_지우고_다시_넣고_ICAM관리가_아닌_펀드_원장은_지우지_않는다() {
        fund("ZZNOICAM", "false");
        jdbc.update("insert into fnd10_book (fnd10_book_id, fnd10_std_date, fnd10_fund_code_id, fnd10_ast_class_tree_id, fnd10_company_id) "
                + "select f_create_seq(), date '2026-11-03', c.fnd01_fund_code_id, t.ast01_class_tree_id, 28000 from fnd01_fund_code c, ast01_class_tree t "
                + "where c.fnd01_fund_cd = 'ZZNOICAM' and c.fnd01_company_id = 28000 and t.ast01_isin = 'ZZBKITEM1' and t.ast01_company_id = 28000");

        action.run(req());
        action.run(req());

        assertThat(count("fnd10_book", "fnd10")).isEqualTo(3);   // ICAM 2 + 사용자 입력 1
        assertThat(count("adv10_book", "adv10")).isEqualTo(2);
    }

    @Test
    void ERP에_없는_펀드면_AS_IS처럼_전체가_실패한다() {
        jdbc.update("delete from fnd01_fund_code where fnd01_fund_cd = 'ZZBK01' and fnd01_company_id = 28000");

        assertThatThrownBy(() -> action.run(req())).isInstanceOf(BusinessException.class)
                .hasMessageContaining("7 fnd10 insertModel SET 실패... fundCode : ZZBK01").hasMessageContaining("NullPointerException");
    }

    @Test
    void ERP에_없는_종목이면_AS_IS처럼_전체가_실패한다() {
        jdbc.update("delete from ast01_class_tree where ast01_isin = 'ZZBKITEM2' and ast01_company_id = 28000");

        assertThatThrownBy(() -> action.run(req())).isInstanceOf(BusinessException.class)
                .hasMessageContaining("8 fnd10 insertModel SET 실패").hasMessageContaining("ZZBKITEM2");
    }

    @Test
    void 기준일_형식이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(new BatchReq("28000", "ZZ시험", null, "2026/11/03", null, null, null, null, null)))
                .isInstanceOf(BusinessException.class);
    }
}
