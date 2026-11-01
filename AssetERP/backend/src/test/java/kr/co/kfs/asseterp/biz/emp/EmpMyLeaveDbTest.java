package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyLeaveService;
import kr.co.kfs.asseterp.biz.sms.service.DisabledSmsSender;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** Y01 휴가신청 — 저장·수정·삭제·기간 계산·초과사용 승인요청 규칙을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpMyLeaveService.class, DisabledSmsSender.class})
class EmpMyLeaveDbTest {

    @Autowired EmpMyLeaveService service;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    private static MyLeaveSaveReq req(Long id, String leaveCode, LocalDate s, LocalDate c, Double cnt, String tel) {
        return new MyLeaveSaveReq(id, leaveCode, null, null, null, s, c, cnt, "개인 사유", "홍길동", tel, "비고", null, null);
    }

    @Test
    void 저장_수정_삭제() {
        LocalDate s = LocalDate.of(2031, 3, 4);
        LocalDate c = LocalDate.of(2031, 3, 5);
        MyLeaveRes saved = service.save(user(), req(-1L, "01", s, c, 2.0, "01012345678"));
        assertThat(saved.leaveId()).isPositive();
        assertThat(saved.emergencyTelno()).isEqualTo("010-1234-5678");   // 11자리는 000-0000-0000 모양
        assertThat(saved.regDate()).isEqualTo(LocalDate.now());          // 등록일 기본 오늘
        assertThat(saved.leaveName()).isNotBlank();
        assertThat(service.search(user(), "2031")).extracting(MyLeaveRes::leaveId).contains(saved.leaveId());

        MyLeaveRes upd = service.save(user(), req(saved.leaveId(), "01", s, c, 1.5, "010-0000-1111"));
        assertThat(upd.leaveCount()).isEqualTo(1.5);

        assertThat(service.hasAltAppr(user(), saved.leaveId())).isFalse();
        service.updateApprId(user(), saved.leaveId(), 1L);
        service.delete(user(), List.of(saved.leaveId()), false);   // 상신 상태가 없는(결재 ID만 있는) 문서
        assertThrows(BusinessException.class, () -> service.get(user(), saved.leaveId()));
    }

    @Test
    void 필수_검사_문구() {
        LocalDate d = LocalDate.of(2031, 4, 1);
        BusinessException e = assertThrows(BusinessException.class, () -> service.save(user(), req(-1L, null, d, d, 1.0, "010")));
        assertThat(e.getMessage()).contains("휴가구분은 필수선택 항목입니다");
        e = assertThrows(BusinessException.class, () -> service.save(user(), req(-1L, "01", d, null, 1.0, "010")));
        assertThat(e.getMessage()).contains("휴가종료일은 필수선택 항목입니다");
        e = assertThrows(BusinessException.class, () -> service.save(user(), req(-1L, "01", d, d, null, "010")));
        assertThat(e.getMessage()).contains("기간 값이 없습니다");
        e = assertThrows(BusinessException.class, () -> service.save(user(), req(-1L, "01", d, d, -1.0, "010")));
        assertThat(e.getMessage()).contains("기간 값을 확인해주세요");
    }

    @Test
    void 기간_계산과_코드_요약() {
        // 2026-03-03(화) ~ 03-09(월) : 평일 5일 (03-02는 삼일절 대체공휴일)
        assertThat(service.count(user(), LocalDate.of(2026, 3, 3), LocalDate.of(2026, 3, 9), "01", "2")).isEqualTo(5.0);
        assertThat(service.count(user(), LocalDate.of(2026, 3, 3), LocalDate.of(2026, 3, 9), "01", "1")).isEqualTo(7.0);   // 일자기준은 달력일
        assertThat(service.getCodes(user()).leaveCodes()).isNotEmpty();
        assertThat(service.getDays(user(), "2026")).isNotNull();
    }

    @Test
    void 초과사용_승인요청은_발송_연동이_없으면_상태를_바꾸지_않는다() {
        LocalDate d = LocalDate.of(2031, 5, 6);
        MyLeaveRes saved = service.save(user(), req(-1L, "01", d, d, 1.0, "010-1111-2222"));
        assertThrows(BusinessException.class, () -> service.requestOverConfirm(user(), saved.leaveId(), 29035L));
        assertThat(service.get(user(), saved.leaveId()).overConfirmStatusCode()).isNull();
    }
}
