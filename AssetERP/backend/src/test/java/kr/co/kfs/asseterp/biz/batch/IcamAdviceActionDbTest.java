package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamAdviceAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
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
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

/** SB15 icamAdvice를 ICAM2 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다. 회사 28000의 자문 ICAM 코드는 시험 안에서만 ZZ99로 바꾼다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamAdviceAction.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamAdviceActionDbTest {

    @Autowired IcamAdviceAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    private void advisCode(String code) {
        jdbc.update("update sys01_company set sys01_icam_advis_company_cd = ? where sys01_company_id = 28000", code);
    }

    private static BatchReq req() {
        return new BatchReq("28000", "ZZ시험", null, null, null, null, null, null, null);
    }

    private Map<String, Object> account(String manageCode) {
        return jdbc.queryForMap("select a.*, TO_DECRYPTS(adv02_account_no) as no_dec from adv02_account a where adv02_company_id = 28000 and adv02_manage_cd = ?", manageCode);
    }

    @Test
    void 자문계좌와_증권사를_넣는다() {
        advisCode("ZZ99");
        int before = jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000", Integer.class);

        assertThat(action.run(req())).isEqualTo("icamAdvice 작업완료..commit");

        assertThat(jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000", Integer.class) - before).isEqualTo(2);
        Map<String, Object> a = account("ADVSIM02");
        assertThat(a.get("adv02_manage_nm")).isEqualTo("시뮬 자문계좌 2, 해지");
        assertThat(a.get("adv02_tr_corp_cd")).isEqualTo("10002");
        assertThat(a.get("no_dec")).isEqualTo("9876543210");        // 암호화해 넣고 복호화로 돌려받는다
        assertThat(a.get("adv02_account_no")).isNotEqualTo("9876543210");
        assertThat(a.get("adv02_close_date").toString()).startsWith("2025-06-30");
        assertThat(a.get("adv02_worker")).isEqualTo("ZZ시험");

        Map<String, Object> c = jdbc.queryForMap("select * from sys15_corp where sys15_company_id = 28000 and sys15_corp_type = '3' and sys15_corp_nm = '시뮬증권'");
        assertThat(c.get("sys15_corp_cd")).isEqualTo("10001");
        assertThat(c.get("sys15_use_yn")).isEqualTo("true");
    }

    @Test
    void 두번_돌려도_바뀐게_없으면_그대로() {
        advisCode("ZZ99");
        action.run(req());
        int accounts = jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000", Integer.class);
        int corps = jdbc.queryForObject("select count(*) from sys15_corp where sys15_company_id = 28000 and sys15_corp_type = '3'", Integer.class);
        Object workDate = account("ADVSIM01").get("adv02_work_date");

        action.run(req());

        assertThat(jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000", Integer.class)).isEqualTo(accounts);
        assertThat(jdbc.queryForObject("select count(*) from sys15_corp where sys15_company_id = 28000 and sys15_corp_type = '3'", Integer.class)).isEqualTo(corps);
        assertThat(account("ADVSIM01").get("adv02_work_date")).isEqualTo(workDate);   // update가 없었다
    }

    @Test
    void 바뀐_계좌는_고치고_증권사코드가_다르면_코드만_고친다() {
        advisCode("ZZ99");
        action.run(req());
        jdbc.update("update adv02_account set adv02_manage_nm = '옛이름' where adv02_company_id = 28000 and adv02_manage_cd = 'ADVSIM01'");
        jdbc.update("update sys15_corp set sys15_corp_cd = 'OLD' where sys15_company_id = 28000 and sys15_corp_type = '3' and sys15_corp_nm = '시뮬증권'");

        action.run(req());

        assertThat(account("ADVSIM01").get("adv02_manage_nm")).isEqualTo("시뮬 자문계좌 1");
        assertThat(jdbc.queryForObject("select sys15_corp_cd from sys15_corp where sys15_company_id = 28000 and sys15_corp_type = '3' and sys15_corp_nm = '시뮬증권'", String.class)).isEqualTo("10001");
    }

    @Test
    void ICAM에_자료가_없으면_알림만_남긴다() {
        advisCode("ZZ00");   // CSV에 없는 코드
        int before = jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000", Integer.class);

        assertThat(action.run(req())).isEqualTo("icamAdvice 작업완료..commit");

        assertThat(jdbc.queryForObject("select count(*) from adv02_account where adv02_company_id = 28000", Integer.class)).isEqualTo(before);
        verify(noticeLog).notice(eq("icamAdvice"), contains("icamAccountList(adv02) size : 0"), contains("ZZ00"));
    }
}
