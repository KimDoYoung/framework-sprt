package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AcntTransferBookReq;
import kr.co.kfs.asseterp.biz.flt.dto.RightsExerciseRes;
import kr.co.kfs.asseterp.biz.flt.dto.RightsExerciseSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltRightsExerciseService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** I07 권리행사/기타입출고(저장·변경·삭제·원장반영)를 asseterpdb에서 실제로 돌리고 롤백한다. 실제 사원·계좌(회사 28000, 사원 29049)에 임시 행만 넣는다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(FltRightsExerciseService.class)
class FltRightsExerciseDbTest {

    @Autowired FltRightsExerciseService service;

    private static final long ACCOUNT_ID = 202508279014175L;
    private static final String START = "2026-10-01";
    private static final String CLOSE = "2026-10-30";
    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private List<RightsExerciseRes> period(String trType, Long accountId) {
        return service.search(user, trType, accountId, START, CLOSE, "시험종목");
    }

    @Test
    void 저장_변경_삭제() {
        RightsExerciseRes saved = service.update(user, List.of(
                new RightsExerciseSaveReq(-1L, "52I", "2026-10-15", ACCOUNT_ID, "10", " 시험종목 ", "KR7000000000", 3.0, 3000L, "메모"))).get(0);
        assertThat(saved.trId()).isPositive();
        assertThat(saved.trType()).isEqualTo("52I");
        assertThat(saved.trTypeName()).isEqualTo("입고");
        assertThat(saved.trItemName()).isEqualTo("시험종목");          // 공백 제거
        assertThat(saved.trDate()).isEqualTo("2026-10-15");            // 실거래일 = 거래일
        assertThat(saved.trNote()).isEqualTo("메모");
        assertThat(saved.accountInfo()).isNotBlank();
        assertThat(period("%", null)).extracting(RightsExerciseRes::trId).contains(saved.trId());
        assertThat(period("52I", ACCOUNT_ID)).extracting(RightsExerciseRes::trId).contains(saved.trId());
        assertThat(period("53O", null)).extracting(RightsExerciseRes::trId).doesNotContain(saved.trId());   // 거래구분 조건

        RightsExerciseRes changed = service.update(user, List.of(
                new RightsExerciseSaveReq(saved.trId(), "52I", "2026-10-15", ACCOUNT_ID, "10", "시험종목", "KR7000000000", 4.0, 4000L, "메모2"))).get(0);
        assertThat(changed.trQty()).isEqualTo(4.0);
        assertThat(changed.trAmt()).isEqualTo(4000L);
        assertThat(changed.trNote()).isEqualTo("메모2");

        // 예치금(99)은 금액 = 수량
        RightsExerciseRes deposit = service.update(user, List.of(
                new RightsExerciseSaveReq(-2L, "52I", "2026-10-15", ACCOUNT_ID, "99", "시험종목 예치금", null, 7000.0, null, null))).get(0);
        assertThat(deposit.trAmt()).isEqualTo(7000L);

        // 다른 사원은 못 지운다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(28000L).roles(List.of("ROLE_USER")).build();
        assertThat(service.delete(other, List.of(deposit.trId()))).isZero();
        assertThat(service.search(other, "%", null, START, CLOSE, "시험종목")).isEmpty();

        // 삭제는 행마다 그 종목의 원장을 다시 만든다('Y'가 아니면 예외)
        assertThat(service.delete(user, List.of(saved.trId(), deposit.trId()))).isEqualTo(2);
        assertThat(period("%", null)).isEmpty();
    }

    @Test
    void 계좌대체_거래는_이_화면에_나오지_않는다() {
        // 매매구분이 FloorTrCode0002 그룹(권리행사/기타입출고)이 아니면(예: 계좌대체 30N) 조회 대상이 아니다
        assertThat(service.search(user, "30N", null, "2000-01-01", "2030-12-31", "")).isEmpty();
    }

    @Test
    void 거래일이_최초원장_기준일_이전이면_막는다() {
        assertThatThrownBy(() -> service.update(user, List.of(
                new RightsExerciseSaveReq(-1L, "52I", "1990-01-01", ACCOUNT_ID, "10", "시험종목", null, 1.0, 1L, null))))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 원장정리는_종목을_한정한다() {
        service.insertFloorTrBook(user, new AcntTransferBookReq("10", "CJ대한통운", "KR7000120006", "2026-01-19"));
    }
}
