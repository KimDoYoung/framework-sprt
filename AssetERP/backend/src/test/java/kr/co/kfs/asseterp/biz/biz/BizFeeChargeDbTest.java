package kr.co.kfs.asseterp.biz.biz;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeConfirmReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeDetailRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeAccountSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.link.AprLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FeeChargeLinkSeedProvider;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeAccountService;
import kr.co.kfs.asseterp.biz.biz.service.BizFeeChargeService;

/** EE21 최저보수 청구(Biz20_Tab_FeeCharge) 목록·편집·확정·삭제·자료생성을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({BizFeeChargeService.class, BizFeeAccountService.class, FeeChargeLinkSeedProvider.class})
class BizFeeChargeDbTest {

    private static final LocalDate Q = LocalDate.of(2024, 6, 30);
    /** 2024-06-30 분기에 청구 2건이 있는 계약사 */
    private static final long CONT_CORP = 202301050852727L;

    @Autowired BizFeeChargeService service;
    @Autowired BizFeeAccountService accountService;
    @Autowired FeeChargeLinkSeedProvider seedProvider;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 목록은_분기와_검색어로_읽는다() {
        List<BizFeeChargeRes> all = service.search(user(), Q, "");
        assertThat(all).hasSize(11);
        assertThat(service.search(user(), Q, "없는운용사zzz")).isEmpty();
    }

    @Test
    void 편집창_등록_수정_확정_삭제() {
        long id = service.nextId();
        long corpId = jdbc.queryForObject("select biz13_corp_id from biz13_with_corp where biz13_cont_corp_id = ? limit 1", Long.class, CONT_CORP);
        LocalDate other = LocalDate.of(2099, 3, 31);

        assertThat(service.sameCorpCount(user(), id, corpId, other)).isZero();
        BizFeeChargeDetailRes saved = service.save(user(), new BizFeeChargeSaveReq(id, other, corpId, CONT_CORP, 100L, 5000L, 500L, "시험"));
        assertThat(saved.targetYn()).isEqualTo("true");
        assertThat(saved.realChargeFee()).isEqualTo(5500L);
        assertThat(service.sameCorpCount(user(), -1L, corpId, other)).isEqualTo(1);

        BizFeeChargeDetailRes again = service.save(user(), new BizFeeChargeSaveReq(id, other, corpId, CONT_CORP, 100L, 0L, null, "고침"));
        assertThat(again.targetYn()).isEqualTo("false");
        assertThat(again.note()).isEqualTo("고침");

        assertThat(service.confirm(user(), new BizFeeChargeConfirmReq(List.of(id), true))).isEqualTo(1);
        assertThat(service.get(user(), id).fixNm()).isEqualTo("확정");
        assertThat(service.confirm(user(), new BizFeeChargeConfirmReq(List.of(id), false))).isEqualTo(1);

        assertThat(service.updateApprId(user(), id, 1L)).isEqualTo(1);
        assertThat(service.delete(user(), List.of(id))).isEqualTo(1);
    }

    @Test
    void 계약사별_자료생성은_그_계약사_구간만_다시_만든다() {
        int otherBefore = jdbc.queryForObject("select count(*) from biz22_fee_charge_calc where biz22_cont_corp_id <> ? and biz22_charge_date = ?", Integer.class, CONT_CORP, Q);
        int chargesBefore = jdbc.queryForObject("select count(*) from biz20_fee_charge where biz20_company_id = 28000 and biz20_charge_date = ?", Integer.class, Q);

        String sel = "select biz20_corp_id, biz20_min_fee, biz20_min_days, biz20_min_start_date, biz20_min_close_date, biz20_calc_start_date, biz20_calc_close_date, biz20_calc_days"
                + " from biz20_fee_charge where biz20_cont_corp_id = ? and biz20_charge_date = ? order by biz20_corp_id";
        List<java.util.Map<String, Object>> asIs = jdbc.queryForList(sel, CONT_CORP, Q);

        assertThat(service.batch(user(), Q, CONT_CORP)).isEqualTo(1);

        // AS-IS 가 만들어 둔 값과 같아야 한다(최저보수는 ICAM 과 무관)
        assertThat(jdbc.queryForList(sel, CONT_CORP, Q)).isEqualTo(asIs);

        assertThat(jdbc.queryForObject("select count(*) from biz22_fee_charge_calc where biz22_cont_corp_id = ? and biz22_charge_date = ?", Integer.class, CONT_CORP, Q)).isPositive();
        // 다른 계약사의 구간은 건드리지 않는다 (deleteTermLastCloseDate 에 계약사·청구일자 조건을 더한 이유)
        assertThat(jdbc.queryForObject("select count(*) from biz22_fee_charge_calc where biz22_cont_corp_id <> ? and biz22_charge_date = ?", Integer.class, CONT_CORP, Q)).isEqualTo(otherBefore);
        assertThat(jdbc.queryForObject("select count(*) from biz20_fee_charge where biz20_company_id = 28000 and biz20_charge_date = ?", Integer.class, Q)).isEqualTo(chargesBefore);
        // ICAM 발생보수는 없으므로 발생보수 0, 청구보수는 최저보수
        assertThat(jdbc.queryForObject("select coalesce(sum(biz20_occ_fee),0) from biz20_fee_charge where biz20_cont_corp_id = ? and biz20_charge_date = ?", Long.class, CONT_CORP, Q)).isZero();
    }

    @Test
    void 분기_전체_자료생성() {
        assertThat(service.batch(user(), Q, null)).isPositive();
    }

    @Test
    void 출력자료는_내_자료를_지우고_목록만큼_담는다() {
        String group = service.rdPrint(user(), Q, "");
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_company_id = 28000 and sys99_person_id = 29049 and sys99_window_class_nm = 'Biz20_Tab_FeeCharge' and sys99_group_id = ?",
                Integer.class, Long.parseLong(group))).isEqualTo(11);
        String again = service.rdPrint(user(), Q, "");   // 다시 부르면 이전 자료는 지워진다
        assertThat(jdbc.queryForObject("select count(*) from sys99_print where sys99_company_id = 28000 and sys99_person_id = 29049 and sys99_window_class_nm = 'Biz20_Tab_FeeCharge'",
                Integer.class)).isEqualTo(11);
        assertThat(again).isNotEqualTo(group);
    }

    @Test
    void 보수입금계좌_조회_등록_수정_삭제() {
        long corpId = jdbc.queryForObject("select biz13_corp_id from biz13_with_corp where biz13_cont_corp_id = ? limit 1", Long.class, CONT_CORP);
        int before = accountService.search(user(), "").size();
        long id = accountService.nextId();
        List<BizFeeAccountRes> saved = accountService.save(user(), List.of(
                new BizFeeAccountSaveReq(id, corpId, LocalDate.of(2099, 1, 1), null, "123-45", "시험예금주", null, "시험")));
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).corpNm()).isNotBlank();
        assertThat(accountService.search(user(), "").size()).isEqualTo(before + 1);
        assertThat(accountService.search(user(), "시험예금주")).extracting(BizFeeAccountRes::accountId).contains(id);

        List<BizFeeAccountRes> again = accountService.save(user(), List.of(
                new BizFeeAccountSaveReq(id, corpId, LocalDate.of(2099, 1, 1), null, "999-99", "바뀜", null, "고침")));
        assertThat(again.get(0).accountNo()).isEqualTo("999-99");
        assertThat(accountService.delete(user(), List.of(id))).isEqualTo(1);
        assertThat(accountService.search(user(), "").size()).isEqualTo(before);
    }

    @Test
    void 상신_문서_시드는_운용사_제목과_입금계좌_본문을_만든다() {
        // 입금계좌가 있는 2024-06-30 청구 (블랙펄자산운용(일임))
        AprLinkSeedProvider.Seed seed = seedProvider.seed(user(), "A19", 202407041718265L);
        assertThat(seed.title()).endsWith(" 사무관리보수 발생내역 및 비용청구의 건");
        assertThat(seed.titleReadOnly()).isFalse();
        assertThat(seed.receiveName()).isNotBlank();
        assertThat(seed.content()).contains("3. 입금계좌 : ").contains("4. 입금기한 : 청구일로부터 10일 이내. 끝.");
        // 통합본(A20)은 제목·본문 없이 제목만 편집 가능
        AprLinkSeedProvider.Seed all = seedProvider.seed(user(), "A20", 0L);
        assertThat(all.title()).isNull();
        assertThat(all.titleReadOnly()).isFalse();
    }
}
