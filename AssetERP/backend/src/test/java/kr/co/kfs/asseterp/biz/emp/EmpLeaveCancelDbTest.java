package kr.co.kfs.asseterp.biz.emp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpLeaveService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** #1033 [휴가취소] — asseterpdb kfstest(28000)의 결재 끝난 휴가로 돌리고 롤백한다(@MybatisTest는 테스트마다 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpLeaveService.class, AprNoticeService.class, NoticeTestConfig.class})
class EmpLeaveCancelDbTest {

    @Autowired EmpLeaveService service;
    @Autowired AprNoticeService notice;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal manager() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").roles(List.of("ROLE_USER")).build();
    }

    private Long completedLeave() {
        return jdbc.queryForObject("""
                select l.emp20_leave_id from emp20_leave l join apr01_appr a on a.apr01_appr_id = l.emp20_appr_id
                 where l.emp20_company_id = 28000 and a.apr01_status_cd = '30' and coalesce(l.emp20_cancel, 'false') <> 'true'
                 order by l.emp20_leave_id desc limit 1""", Long.class);
    }

    @Test
    void 결재_끝난_휴가를_취소하면_결재문서를_폐기문서로_옮기고_취소로_표시한다() {
        Long leaveId = completedLeave();
        Long apprId = jdbc.queryForObject("select emp20_appr_id from emp20_leave where emp20_leave_id = ?", Long.class, leaveId);
        String title = jdbc.queryForObject("select apr01_title from apr01_appr where apr01_appr_id = ?", String.class, apprId);
        int del = jdbc.queryForObject("select count(*) from apr99_appr_del", Integer.class);

        List<AprNoticeCall> calls = notice.planLeaveCancel(28000L, apprId);
        assertThat(calls).allSatisfy(c -> assertThat(c.body()).contains(title).contains("취소되었습니다"));

        service.cancelLeave(manager(), leaveId);

        assertThat(jdbc.queryForObject("select count(*) from apr99_appr_del", Integer.class)).isEqualTo(del + 1);
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, apprId)).isZero();
        assertThat(jdbc.queryForObject("select emp20_cancel from emp20_leave where emp20_leave_id = ?", String.class, leaveId)).isEqualTo("true");
        // 결재문서가 없어졌으니 다시 취소할 수 없다
        assertThatThrownBy(() -> service.cancelLeave(manager(), leaveId)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 상신하지_않은_휴가와_다른_회사_휴가는_취소할_수_없다() {
        Long draft = jdbc.queryForObject("select emp20_leave_id from emp20_leave where emp20_company_id = 28000 and emp20_appr_id is null limit 1", Long.class);
        assertThatThrownBy(() -> service.cancelLeave(manager(), draft)).isInstanceOf(BusinessException.class).hasMessageContaining("취소가 불가능");
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(-999L).name("x").roles(List.of("ROLE_USER")).build();
        assertThatThrownBy(() -> service.cancelLeave(other, completedLeave())).isInstanceOf(BusinessException.class);
    }
}
