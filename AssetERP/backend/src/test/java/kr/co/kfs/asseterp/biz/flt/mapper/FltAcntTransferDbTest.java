package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferBookReq;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferRes;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.BookRes;
import kr.co.kfs.asseterp.biz.flt.service.FltAcntTransferService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** I06 계좌대체(저장·변경·삭제·원장반영)를 asseterpdb에서 실제로 돌리고 롤백한다. 실제 사원·계좌(회사 28000, 사원 29049)에 임시 행만 넣는다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FltAcntTransferService.class)
class FltAcntTransferDbTest {

    @Autowired FltAcntTransferService service;
    @Autowired FltBookMapper bookMapper;

    private static final long OUT_ACCOUNT_ID = 202204070100311L;
    private static final long IN_ACCOUNT_ID = 202405231704903L;
    private static final String START = "2026-10-01";
    private static final String CLOSE = "2026-10-30";
    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private List<AcntTransferRes> period(Long accountId) {
        return service.search(user, accountId, START, CLOSE, "시험종목");
    }

    @Test
    void 저장_변경_삭제() {
        AcntTransferRes saved = service.update(user, List.of(
                new AcntTransferSaveReq(-1L, "2026-10-15", "10", " 시험종목 ", "KR7000000000", 3.0, 3000L, OUT_ACCOUNT_ID, IN_ACCOUNT_ID))).get(0);
        assertThat(saved.trId()).isPositive();
        assertThat(saved.trType()).isEqualTo("30N");
        assertThat(saved.trItemName()).isEqualTo("시험종목");          // 공백 제거
        assertThat(saved.trDate()).isEqualTo("2026-10-15");            // 실거래일 = 대체일
        assertThat(saved.outAccountInfo()).isNotBlank();
        assertThat(saved.accountInfo()).isNotBlank();
        assertThat(period(null)).extracting(AcntTransferRes::trId).contains(saved.trId());
        assertThat(period(IN_ACCOUNT_ID)).extracting(AcntTransferRes::trId).contains(saved.trId());
        assertThat(period(OUT_ACCOUNT_ID)).extracting(AcntTransferRes::trId).doesNotContain(saved.trId());   // 계좌 조건은 입고계좌

        AcntTransferRes changed = service.update(user, List.of(
                new AcntTransferSaveReq(saved.trId(), "2026-10-15", "10", "시험종목", "KR7000000000", 4.0, 4000L, OUT_ACCOUNT_ID, IN_ACCOUNT_ID))).get(0);
        assertThat(changed.trQty()).isEqualTo(4.0);
        assertThat(changed.trAmt()).isEqualTo(4000L);

        // 예치금(99)은 금액 = 수량
        AcntTransferRes deposit = service.update(user, List.of(
                new AcntTransferSaveReq(-2L, "2026-10-15", "99", "시험종목 예치금", null, 7000.0, null, OUT_ACCOUNT_ID, IN_ACCOUNT_ID))).get(0);
        assertThat(deposit.trAmt()).isEqualTo(7000L);

        // 다른 사원은 못 지운다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_USER")).build();
        assertThat(service.delete(other, List.of(deposit.trId()))).isZero();
        assertThat(service.search(other, null, START, CLOSE, "시험종목")).isEmpty();

        // 삭제는 행마다 그 종목의 원장을 다시 만든다('Y'가 아니면 예외)
        assertThat(service.delete(user, List.of(saved.trId(), deposit.trId()))).isEqualTo(2);
        assertThat(period(null)).isEmpty();
    }

    @Test
    void 대체일이_최초원장_기준일_이전이면_막는다() {
        assertThatThrownBy(() -> service.update(user, List.of(
                new AcntTransferSaveReq(-1L, "1990-01-01", "10", "시험종목", null, 1.0, 1L, OUT_ACCOUNT_ID, IN_ACCOUNT_ID))))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 원장정리는_종목을_한정한다() {
        service.insertFloorTrBook(user, new AcntTransferBookReq("10", "CJ대한통운", "KR7000120006", "2026-01-19"));
    }

    @Test
    void 보유잔고_조회는_계좌_열을_준다() {
        List<BookRes> books = bookMapper.selectBooks(28000L, 29049L, null, "2026-01-19", "%");
        assertThat(books).isNotEmpty();
        assertThat(books).allSatisfy(b -> {
            assertThat(b.accountId()).isNotNull();
            assertThat(b.accountInfo()).isNotBlank();
        });
        Long first = books.get(0).accountId();
        assertThat(bookMapper.selectBooks(28000L, 29049L, first, "2026-01-19", "%")).extracting(BookRes::accountId).containsOnly(first);
    }
}
