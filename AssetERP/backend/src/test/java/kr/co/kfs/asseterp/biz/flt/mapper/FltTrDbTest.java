package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrCheckRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusReq;
import kr.co.kfs.asseterp.biz.flt.dto.TrUnfillReq;
import kr.co.kfs.asseterp.biz.flt.service.FltTrService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** I03 매수 사전신고(저장·승인신청·신청취소·미체결·삭제)를 asseterpdb에서 실제로 돌리고 롤백한다. 실제 사원·계좌(회사 28000, 사원 29049)에 임시 행만 넣는다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({FltTrService.class})
class FltTrDbTest {

    @Autowired FltTrService service;

    private static final long ACCOUNT_ID = 202204070100311L;
    private static final String REG_DATE = "2026-12-01";
    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private List<TrRes> today() {
        return service.search(user, "10I", ACCOUNT_ID, REG_DATE, null, null, null);
    }

    @Test
    void 저장_승인신청_신청취소_미체결_삭제() {
        TrRes saved = service.update(user, List.of(new TrSaveReq(-1L, "10I", ACCOUNT_ID, REG_DATE, "2026-12-02", "10", " 시험종목 ", "KR7000000000", 3.0, 3000L, "사유")))
                .get(0);
        assertThat(saved.trId()).isPositive();
        assertThat(saved.itemName()).isEqualTo("시험종목");          // 공백 제거
        assertThat(saved.trTypeName()).isEqualTo("매수");
        assertThat(saved.statusCode()).isNull();
        assertThat(saved.unfillYn()).isFalse();
        assertThat(saved.accountRelateCode()).isNotNull();
        assertThat(today()).hasSize(1);

        TrRes changed = service.update(user, List.of(new TrSaveReq(saved.trId(), "10I", ACCOUNT_ID, REG_DATE, "2026-12-02", "10", "시험2", null, 4.0, 4000L, null))).get(0);
        assertThat(changed.itemName()).isEqualTo("시험2");
        assertThat(changed.expectTrQty()).isEqualTo(4.0);
        assertThat(changed.expectTrAmt()).isEqualTo(4000L);

        // 승인신청 "10" → 신청취소 null
        assertThat(service.updateStatus(user, new TrStatusReq(List.of(saved.trId()), "10"))).isEqualTo(1);
        assertThat(today().get(0).statusCode()).isEqualTo("10");
        assertThat(service.updateStatus(user, new TrStatusReq(List.of(saved.trId()), null))).isEqualTo(1);
        assertThat(today().get(0).statusCode()).isNull();
        assertThatThrownBy(() -> service.updateStatus(user, new TrStatusReq(List.of(saved.trId()), "20"))).isInstanceOf(BusinessException.class);

        // 미체결 처리·취소
        assertThat(service.updateUnfill(user, new TrUnfillReq(List.of(saved.trId()), true))).isEqualTo(1);
        assertThat(today().get(0).unfillYn()).isTrue();
        assertThat(service.updateUnfill(user, new TrUnfillReq(List.of(saved.trId()), false))).isEqualTo(1);
        assertThat(today().get(0).unfillYn()).isFalse();

        // 다른 사원은 못 지운다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_USER")).build();
        assertThat(service.delete(other, List.of(saved.trId()))).isZero();
        assertThat(service.delete(user, List.of(saved.trId()))).isEqualTo(1);
        assertThat(today()).isEmpty();
    }

    @Test
    void 안내_한도_계좌_종목유형_매수제한은_읽힌다() {
        TrCheckRes check = service.check(user, null);
        assertThat(check.today()).matches("\\d{4}-\\d{2}-\\d{2}");
        assertThat(check.fltOnlyCurrYn()).isNotNull();
        assertThat(service.investLimit(user, check.today())).hasSize(3);
        assertThat(service.accounts(user, check.today())).isNotEmpty();
        assertThat(service.itemTypeCodes(user, check.today())).isNotEmpty();
        assertThat(service.expectTrDate(user, check.today())).isNotNull();
        BuyLockupRes none = service.buyLockup(user, "ZZ-NO-SUCH-ITEM", check.today());
        assertThat(none.status()).isEqualTo("OK");
    }

    @Test
    void 매도_사전신고는_보유_열과_함께_읽힌다() {
        TrRes saved = service.update(user, List.of(new TrSaveReq(-1L, "20O", ACCOUNT_ID, "2026-08-20", "2026-08-21", "10", "KCC", "KR7002380004", 5.0, 1000L, null))).get(0);
        assertThat(saved.trTypeName()).isEqualTo("매도");
        assertThat(saved.bookQty()).isNotNull();
        assertThat(saved.bookAmt()).isNotNull();
        assertThat(service.search(user, "20O", ACCOUNT_ID, "2026-08-20", null, null, null)).extracting(TrRes::trId).contains(saved.trId());
    }
}
