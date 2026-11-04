package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.IcamOfficeMngFeeAction;
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

/** SB24 icamOfficeMngFee를 시뮬레이터 CSV로 asseterpdb에서 실제로 돌리고 롤백한다(DB 함수 3개도 실제 호출) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({IcamOfficeMngFeeAction.class, IcamFeeSupport.class, CsvIcamReader.class})
@TestPropertySource(properties = {"asseterp.icam.mode=simulator", "asseterp.icam.simulator-dir=../data/icam-simulator"})
class IcamOfficeMngFeeActionDbTest {

    private static final long CO = 28000L;

    @Autowired IcamOfficeMngFeeAction action;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean BatchNoticeLogService noticeLog;

    private static BatchReq req(String companyId) {
        return new BatchReq(companyId, "ZZ시험", null, null, "2026-10-01", "2026-10-31", null, null, null);
    }

    /** 9901·9903 = 계약사관리 운영구분 '자산운용', 9902 = 아님. 9903은 사용 안 함 거래처라 새로 만들어진다 */
    private void setup() {
        jdbc.update("insert into sys15_corp (sys15_corp_id, sys15_company_id, sys15_corp_nm, sys15_corp_type, sys15_use_yn, sys15_corp_cd) values (-9901, ?, '시뮬운용사A', '5', 'true', '9901')", CO);
        jdbc.update("insert into sys15_corp (sys15_corp_id, sys15_company_id, sys15_corp_nm, sys15_corp_type, sys15_use_yn, sys15_corp_cd) values (-9902, ?, '시뮬운용사B', '5', 'true', '9902')", CO);
        jdbc.update("insert into sys15_corp (sys15_corp_id, sys15_company_id, sys15_corp_nm, sys15_corp_type, sys15_use_yn, sys15_corp_cd) values (-9903, ?, '옛시뮬운용사C', '5', 'false', '9903')", CO);
        jdbc.update("insert into biz13_with_corp (biz13_with_corp_id, biz13_company_id, biz13_manage_type, biz13_corp_id, biz13_first_start_date) values (-1, ?, '1', -9901, date '2020-01-01')", CO);
        jdbc.update("insert into biz13_with_corp (biz13_with_corp_id, biz13_company_id, biz13_manage_type, biz13_corp_id, biz13_first_start_date) values (-2, ?, '2', -9902, date '2020-01-01')", CO);
        jdbc.update("insert into biz13_with_corp (biz13_with_corp_id, biz13_company_id, biz13_manage_type, biz13_corp_id, biz13_first_start_date) values (-3, ?, '1', -9903, date '2020-01-01')", CO);
    }

    @Test
    void 자산운용_운영구분_운용사만_넣고_입금계좌와_거래처를_만들고_함수를_부른다() {
        setup();
        jdbc.update("insert into icam10_fee (icam10_fee_id, icam10_company_id, icam10_std_date, icam10_fee_type, icam10_fund_cd) values (f_create_batchseq(), ?, date '2026-10-15', '20407', 'OLDFEE')", CO);

        assertThat(action.run(req("28000"))).isEqualTo("사무관리보수분개 가져오기 작업완료..commit");

        // 기간 안 옛 행은 지워지고, 9901(2행)·9903(1행)만 들어간다. 9902는 운영구분이 달라 제외
        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_fund_cd = 'OLDFEE'", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_company_id = ? and icam10_icam_company_cd = '9901'", Integer.class, CO)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_company_id = ? and icam10_icam_company_cd = '9902'", Integer.class, CO)).isZero();
        var f = jdbc.queryForMap("select * from icam10_fee where icam10_company_id = ? and icam10_fee_type = '24926' and icam10_icam_company_cd = '9901'", CO);
        assertThat(((Number) f.get("icam10_fee")).longValue()).isEqualTo(500000L);
        assertThat(f.get("icam10_worker")).isEqualTo("ZZ시험");
        assertThat(f.get("icam10_af_pay_date").toString()).isEqualTo("2026-12-31");

        // 말일 보수잔액
        assertThat(jdbc.queryForObject("select count(*) from icam12_fee_book where icam12_company_id = ? and icam12_icam_company_cd = '9901'", Integer.class, CO)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from icam12_fee_book where icam12_company_id = ? and icam12_icam_company_cd = '9902'", Integer.class, CO)).isZero();

        // 신규 펀드 입금계좌 1건씩(같은 펀드 두 행이어도 하나)
        assertThat(jdbc.queryForObject("select count(*) from icam11_fee_deposit where icam11_company_id = ? and icam11_fund_cd = 'ZZFND1'", Integer.class, CO)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from icam11_fee_deposit where icam11_company_id = ? and icam11_fund_cd = 'ZZFND2'", Integer.class, CO)).isZero();

        // 사용 중인 거래처가 없던 9903만 운용사(5) 거래처가 새로 생긴다
        var c = jdbc.queryForMap("select * from sys15_corp where sys15_company_id = ? and sys15_corp_cd = '9903' and sys15_use_yn = 'true'", CO);
        assertThat(c.get("sys15_corp_nm")).isEqualTo("시뮬운용사C");
        assertThat(c.get("sys15_corp_type")).isEqualTo("5");
        assertThat(((Number) c.get("sys15_seq")).longValue()).isEqualTo(9903L);
        assertThat(jdbc.queryForObject("select count(*) from sys15_corp where sys15_company_id = ? and sys15_corp_cd = '9901'", Integer.class, CO)).isEqualTo(1);
    }

    @Test
    void 다시_돌려도_같은_기간은_지우고_다시_넣어_중복이_없다() {
        setup();
        action.run(req("28000"));
        action.run(req("28000"));

        assertThat(jdbc.queryForObject("select count(*) from icam10_fee where icam10_company_id = ? and icam10_icam_company_cd in ('9901','9903')", Integer.class, CO)).isEqualTo(3);
        assertThat(jdbc.queryForObject("select count(*) from icam11_fee_deposit where icam11_company_id = ? and icam11_fund_cd = 'ZZFND1'", Integer.class, CO)).isEqualTo(1);
    }

    @Test
    void 사무관리보수_대상_회사가_아니거나_입력이_틀리면_거절한다() {
        assertThatThrownBy(() -> action.run(req("202603261579560"))).isInstanceOf(BusinessException.class).hasMessageContaining("해당없는 회사코드");
        assertThatThrownBy(() -> action.run(req(null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> action.run(new BatchReq("28000", null, null, null, "2026/10/01", "2026-10-31", null, null, null))).isInstanceOf(BusinessException.class);
    }
}
