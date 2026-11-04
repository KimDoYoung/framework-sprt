package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamFundBookAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.icam.reader.CsvIcamReader;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.common.error.BusinessException;
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

/** SB17 icamFundBook을 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamFundBookAction.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamFundBookActionDbTest {

    @Autowired IcamFundBookAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    private static BatchReq req(String start, String close) {
        return new BatchReq("ALL", "ZZ시험", null, null, start, close, null, null, null);
    }

    private int count(String where) {
        return jdbc.queryForObject("select count(*) from icam06_fund_book where " + where, Integer.class);
    }

    @Test
    void 기간의_펀드원장을_넣는다() {
        // 개발 DB에서 이 회사(2018)의 시험 기간 원장은 없다고 가정하지 않고, 지워지는 것까지 포함해 결과를 본다
        assertThat(action.run(req("2026-10-01", "2026-11-03"))).isEqualTo("펀드원장 작업완료..commit");

        assertThat(count("icam06_icam_company_cd = '2018' and icam06_std_date between date '2026-10-01' and date '2026-11-03'")).isEqualTo(3);
        var r = jdbc.queryForMap("select * from icam06_fund_book where icam06_icam_company_cd = '2018' and icam06_fund_cd = 'SIM002'");
        assertThat(r.get("icam06_fund_nm")).isEqualTo("시뮬레이션 펀드 2호, 외화");
        assertThat(r.get("icam06_multi_class_cd")).isEqualTo("MC001");
        assertThat(((Number) r.get("icam06_nav")).longValue()).isEqualTo(520000000L);
        assertThat(((Number) r.get("icam06_for_nav")).longValue()).isEqualTo(310000L);
        assertThat(r.get("icam06_worker")).isEqualTo("ZZ시험");
    }

    @Test
    void 다시_돌리면_그_기간을_지우고_다시_넣어_중복이_없다() {
        action.run(req("2026-10-01", "2026-11-03"));
        action.run(req("2026-10-01", "2026-11-03"));

        assertThat(count("icam06_icam_company_cd = '2018' and icam06_std_date between date '2026-10-01' and date '2026-11-03'")).isEqualTo(3);
    }

    @Test
    void 기간_밖의_원장은_지우지_않는다() {
        jdbc.update("insert into icam06_fund_book (icam06_fund_book_id, icam06_icam_company_cd, icam06_std_date, icam06_fund_cd) values (f_create_batchseq(), '2018', date '2026-09-01', 'OLDFUND')");

        action.run(req("2026-10-01", "2026-11-03"));

        assertThat(count("icam06_fund_cd = 'OLDFUND'")).isEqualTo(1);
    }

    @Test
    void 기간_형식이_틀리거나_종료일이_없으면_거절한다() {
        assertThatThrownBy(() -> action.run(req("2026/10/01", "2026-11-03"))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> action.run(req("2026-10-01", null))).isInstanceOf(BusinessException.class);
    }
}
