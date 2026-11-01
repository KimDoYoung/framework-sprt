package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveListRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpLeaveListService;

/** Y02 휴가신청조회 — 조회와 출력 자료 삽입을 asseterpdb에서 확인한다(테스트 트랜잭션 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(EmpLeaveListService.class)
class EmpLeaveListDbTest {

    @Autowired EmpLeaveListService service;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 조회는_이름_조건과_기간을_따른다() {
        LocalDate from = LocalDate.of(2025, 1, 1);
        LocalDate to = LocalDate.of(2026, 12, 31);
        List<LeaveListRes> all = service.search(user(), null, from, to);
        assertThat(all).isNotEmpty();
        List<LeaveListRes> one = service.search(user(), "천영임", from, to);
        assertThat(one).isNotEmpty().allMatch(r -> "천영임".equals(r.personName()));
        assertThat(one.size()).isLessThanOrEqualTo(all.size());
    }

    @Test
    void 출력_자료를_넣고_그룹ID를_돌려준다() {
        String groupId = service.insertRdDownload(user(), "천영임", LocalDate.of(2025, 1, 1), LocalDate.of(2026, 12, 31));
        assertThat(Long.parseLong(groupId)).isPositive();
        // 다시 누르면 내 이전 자료를 지우고 새 그룹을 만든다
        assertThat(service.insertRdDownload(user(), "천영임", LocalDate.of(2025, 1, 1), LocalDate.of(2026, 12, 31))).isNotEqualTo(groupId);
    }
}
