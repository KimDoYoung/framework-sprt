package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.ExtrFundAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.AssetErpFundSync;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;

/** SB14 extrFund를 asseterpdb에서 실제로 돌리고 롤백한다(ifi29·ifi30·fnd06 시험 행은 시험 안에서 넣는다). 알림 로그는 별도 트랜잭션이라 목으로 확인한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({ExtrFundAction.class, AssetErpFundSync.class})
class ExtrFundActionDbTest {

    private static final String TODAY = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

    @Autowired ExtrFundAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    @BeforeEach
    void seed() {
        jdbc.update("insert into ifi29_am_corp_mapping (ifi29_am_corp_mapping_id, ifi29_if_cd, ifi29_am_corp_cd, ifi29_am_corp_nm, ifi29_company_id, ifi29_start_date) "
                + "values (f_create_seq(), 'SFTP_SHFP_01', 'ZZAM', '시험운용사', 28000, date '2000-01-01')");
    }

    private void fund(String sendDate, String code, String name, String endYn, String endDate) {
        jdbc.update("insert into ifi30_fund (ifi30_fund_id, ifi30_if_cd, ifi30_send_date, ifi30_am_corp_cd, ifi30_fund_cd, ifi30_fund_nm, "
                + "ifi30_first_set_date, ifi30_end_date, ifi30_end_yn, ifi30_kofia_fund_cd, ifi30_opr_dept, ifi30_operator1, "
                + "ifi30_cust_cd, ifi30_cust_nm, ifi30_office_work_cd, ifi30_office_work_nm, ifi30_am_rate, ifi30_set_amt, ifi30_nav, ifi30_cur_cd, ifi30_next_close_date) "
                + "values (f_create_seq(), 'SFTP_SHFP_01', ?, 'ZZAM', ?, ?, '20200102', ?, ?, 'KRX1', '시험부', '시험역', 'EXC1', '시험수탁', 'EXOW1', '시험사무', 5.5, 1000, 1100, 'KRW', '20261231')",
                sendDate, code, name, endDate, endYn);
    }

    private void officeWorkMapping() {
        jdbc.update("insert into fnd06_office_work (fnd06_office_work_id, fnd06_office_work_cd, fnd06_office_work_nm, fnd06_office_work_use_yn, fnd06_company_id, fnd06_etc_office_work_cd01) "
                + "values (f_create_seq(), 'EXOWCD1', '자체사무수탁', 'true', 0, 'EXOW1')");
    }

    private static BatchReq req() {
        return new BatchReq("28000", "ZZ시험", "SFTP_SHFP_01", null, null, null, null, null, null);
    }

    private Map<String, Object> fnd02(String fundCode) {
        return jdbc.queryForMap("select i.* from fnd02_fund_info i join fnd01_fund_code c on c.fnd01_fund_code_id = i.fnd02_fund_code_id "
                + "where c.fnd01_fund_cd = ? and c.fnd01_company_id = 28000", fundCode);
    }

    @Test
    void 오늘_송신분으로_수탁사_사무수탁사_펀드를_만든다() {
        officeWorkMapping();
        fund(TODAY, "EXF1", "타사무 펀드 1호", "N", null);

        assertThat(action.run(req())).isEqualTo("extrFUND 작업완료..commit");

        // 수탁사: 외부 코드가 etc01에도 들어간다
        Map<String, Object> c = jdbc.queryForMap("select * from fnd03_consignment where fnd03_company_id = 28000 and fnd03_consignment_cd = 'EXC1'");
        assertThat(c.get("fnd03_consignment_nm")).isEqualTo("시험수탁");
        assertThat(c.get("fnd03_etc_consignment_cd01")).isEqualTo("EXC1");
        // 사무수탁사: 회사 0의 맵핑을 회사 28000에 복사하고 외부 코드를 etc01에 둔다
        Map<String, Object> o = jdbc.queryForMap("select * from fnd06_office_work where fnd06_company_id = 28000 and fnd06_office_work_cd = 'EXOWCD1'");
        assertThat(o.get("fnd06_etc_office_work_cd01")).isEqualTo("EXOW1");
        // 펀드: ICAM 관리가 아니므로 icam_yn false, 운용부서명이 들어간다
        assertThat(jdbc.queryForObject("select fnd01_icam_yn from fnd01_fund_code where fnd01_fund_cd = 'EXF1' and fnd01_company_id = 28000", String.class)).isEqualTo("false");
        assertThat(jdbc.queryForObject("select fnd01_close_yn from fnd01_fund_code where fnd01_fund_cd = 'EXF1' and fnd01_company_id = 28000", String.class)).isEqualTo("false");
        Map<String, Object> f = fnd02("EXF1");
        assertThat(f.get("fnd02_fund_nm")).isEqualTo("타사무 펀드 1호");
        assertThat(f.get("fnd02_fund_full_nm")).isEqualTo("타사무 펀드 1호");
        assertThat(f.get("fnd02_org_code_nm")).isEqualTo("시험부");
        assertThat(f.get("fnd02_consignment_cd")).isEqualTo("EXC1");
        assertThat(f.get("fnd02_office_work_cd")).isEqualTo("EXOWCD1");
        assertThat(f.get("fnd02_diff_div_yn")).isNull();
        assertThat(((Number) f.get("fnd02_management_rate")).doubleValue()).isEqualTo(5.5);
    }

    @Test
    void 해지여부가_Y면_해지일과_해지구분이_들어간다() {
        officeWorkMapping();
        fund(TODAY, "EXF2", "해지 펀드", "Y", "20260901");

        action.run(req());

        Map<String, Object> c = jdbc.queryForMap("select * from fnd01_fund_code where fnd01_fund_cd = 'EXF2' and fnd01_company_id = 28000");
        assertThat(c.get("fnd01_close_yn")).isEqualTo("true");
        assertThat(c.get("fnd01_end_date").toString()).startsWith("2026-09-01");
    }

    @Test
    void 두번_돌려도_바뀐게_없으면_fnd02를_새로_넣지_않는다() {
        officeWorkMapping();
        fund(TODAY, "EXF1", "타사무 펀드 1호", "N", null);
        action.run(req());
        Object id = fnd02("EXF1").get("fnd02_fund_info_id");

        action.run(req());

        assertThat(fnd02("EXF1").get("fnd02_fund_info_id")).isEqualTo(id);
    }

    @Test
    void 오늘이_아닌_송신분은_무시한다() {
        officeWorkMapping();
        fund("20200101", "EXF3", "옛 펀드", "N", null);

        action.run(req());

        assertThat(jdbc.queryForObject("select count(*) from fnd01_fund_code where fnd01_fund_cd = 'EXF3'", Integer.class)).isZero();
    }

    @Test
    void 사무수탁사_맵핑코드가_없으면_알림을_남기고_AS_IS처럼_전체가_실패한다() {
        fund(TODAY, "EXF4", "맵핑 없는 펀드", "N", null);

        assertThatThrownBy(() -> action.run(req())).isInstanceOf(BusinessException.class).hasMessageContaining("out of bounds");

        verify(noticeLog).notice(eq("extrFund"), contains("사무수탁사 맵핑코드 없음 : ifCode(SFTP_SHFP_01) / officeWorkCode(EXOW1)"), isNull());
    }
}
