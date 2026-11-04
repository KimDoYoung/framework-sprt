package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamFundMngFeeAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.batch.service.IcamFeeSupport;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB25 icamFundMngFee를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다(DB 함수 3개도 실제 호출) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamFundMngFeeAction.class, IcamFeeSupport.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamFundMngFeeActionDbTest {

    private static final long CO = 28000L;

    @Autowired IcamFundMngFeeAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    private static BatchReq req(String companyId) {
        return new BatchReq(companyId, "ZZ시험", null, null, "2026-10-01", "2026-10-31", null, null, null);
    }

    @Test
    void 운용보수_발생내역과_말일잔액을_넣고_입금계좌를_만든다() {
        jdbc.update("insert into icam10_fee (icam10_fee_id, icam10_company_id, icam10_std_date, icam10_fee_type, icam10_fund_cd) values (f_create_batchseq(), ?, date '2026-10-15', '24923', 'OLDFEE')", CO);
        jdbc.update("insert into icam10_fee (icam10_fee_id, icam10_company_id, icam10_std_date, icam10_fee_type, icam10_fund_cd) values (f_create_batchseq(), ?, date '2026-10-15', '20407', 'OFFICEFEE')", CO);

        assertThat(action.run(req("28000"))).isEqualTo("운용보수분개 가져오기 작업완료..commit");

        // 운용보수 유형(20402·24923) 옛 행만 지우고 사무관리보수 행은 건드리지 않는다
        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_fund_cd = 'OLDFEE'", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_fund_cd = 'OFFICEFEE'", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_company_id = ? and icam10_fund_cd = 'ZZFND9'", Integer.class, CO)).isEqualTo(2);
        var f = jdbc.queryForMap("select * from icam10_fee where icam10_company_id = ? and icam10_fee_type = '20402' and icam10_fund_cd = 'ZZFND9'", CO);
        assertThat(((Number) f.get("icam10_fee")).longValue()).isEqualTo(2000000L);
        assertThat(f.get("icam10_icam_company_nm")).isEqualTo("시뮬자산운용");
        assertThat(f.get("icam10_worker")).isEqualTo("ZZ시험");
        assertThat(jdbc.queryForObject("select count(*) from icam12_fee_book where icam12_company_id = ? and icam12_fund_cd = 'ZZFND9'", Integer.class, CO)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from icam11_fee_deposit where icam11_company_id = ? and icam11_fund_cd = 'ZZFND9'", Integer.class, CO)).isEqualTo(1);
    }

    @Test
    void 다시_돌려도_중복이_없다() {
        action.run(req("28000"));
        action.run(req("28000"));

        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_company_id = ? and icam10_fund_cd = 'ZZFND9'", Integer.class, CO)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from icam12_fee_book where icam12_company_id = ? and icam12_fund_cd = 'ZZFND9'", Integer.class, CO)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from icam11_fee_deposit where icam11_company_id = ? and icam11_fund_cd = 'ZZFND9'", Integer.class, CO)).isEqualTo(1);
    }

    @Test
    void 기간_형식이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(new BatchReq("ALL", null, null, null, "2026/10/01", "2026-10-31", null, null, null)))
                .isInstanceOf(BusinessException.class);
    }
}
