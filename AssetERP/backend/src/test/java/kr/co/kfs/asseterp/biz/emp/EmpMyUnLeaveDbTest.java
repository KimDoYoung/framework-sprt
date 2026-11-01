package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyUnLeaveRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyUnLeaveService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** Y03 연월차휴가 지정통보 — 본인 조회와 지정통보 결재문서 기록 규칙을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpMyUnLeaveService.class)
class EmpMyUnLeaveDbTest {

    @Autowired EmpMyUnLeaveService service;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 본인_것만_조회하고_연도_형식을_검사한다() {
        List<MyUnLeaveRes> mine = service.search(user(29035L), "2026");
        assertThat(mine).allMatch(r -> r.personId().equals(29035L));
        assertThat(service.search(user(29049L), "2026")).noneMatch(r -> r.personId().equals(29035L));
        assertThrows(BusinessException.class, () -> service.search(user(29035L), "26"));
    }

    @Test
    void 지정통보_결재문서_기록은_본인_줄과_진행_상태만_받는다() {
        MyUnLeaveRes any = service.search(user(29035L), "2026").stream().findFirst().orElse(null);
        if (any == null) return;   // 시험 사원의 올해 통보가 없으면 건너뜀
        // 남의 줄
        assertThrows(BusinessException.class, () -> service.updateExpectApprId(user(29049L), any.unLeaveId(), 1L));
        boolean running = any.expectApprStatusCode() != null && List.of("10", "20", "30").contains(any.expectApprStatusCode());
        if (running) {
            assertThrows(BusinessException.class, () -> service.updateExpectApprId(user(29035L), any.unLeaveId(), 1L));
        } else {
            service.updateExpectApprId(user(29035L), any.unLeaveId(), 1L);   // 롤백
        }
    }
}
