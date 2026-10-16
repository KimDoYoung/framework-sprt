package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingReq;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysLeaveYearService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** A26 연차휴가 결산기준을 asseterpdb에서 실제로 돌리고 롤백한다. 연차 행은 없는 회사(99999)로, 회사 설정은 실제 회사 행을 고쳤다가 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysLeaveYearService.class)
class LeaveYearDbTest {

    private static final long FAKE = 99999L;

    @Autowired SysLeaveYearService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal fake = UserPrincipal.builder().userId(1L).companyId(FAKE).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(FAKE + 1).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(3L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 연차_등록_수정_삭제는_근속연수_숫자순이고_로그인_회사_범위() {
        List<LeaveYearRes> saved = service.update(fake, List.of(new LeaveYearSaveReq(0L, "10", "17"), new LeaveYearSaveReq(-1L, "2", "15")));
        assertThat(saved).extracting(LeaveYearRes::year).containsExactly("10", "2");
        assertThat(service.search(fake)).extracting(LeaveYearRes::year).containsExactly("2", "10");  // 숫자순
        assertThat(service.search(other)).isEmpty();
        Long id = saved.get(0).leaveYearId();
        assertThat(service.update(fake, List.of(new LeaveYearSaveReq(id, "10", "18"))).get(0).leaveDays()).isEqualTo("18");
        // 남의 회사 행은 고칠 수도 지울 수도 없다
        assertThatThrownBy(() -> service.update(other, List.of(new LeaveYearSaveReq(id, "10", "99")))).isInstanceOf(BusinessException.class);
        assertThat(service.delete(other, List.of(id))).isZero();
        assertThat(service.delete(fake, List.of(id))).isEqualTo(1);
    }

    @Test
    void 회사_설정은_휴가초과허용여부와_결산월만_바꾼다() {
        LeaveSettingRes before = service.getSetting(kfstest);
        String noteBefore = jdbc.queryForObject("select md5(t::text) from sys01_company t where sys01_company_id=28000", String.class);
        LeaveSettingRes after = service.updateSetting(kfstest, new LeaveSettingReq("false", "03"));
        assertThat(after.leaveYn()).isEqualTo("false");
        assertThat(after.leaveMonthCode()).isEqualTo("03");
        assertThat(before.companyId()).isEqualTo(28000L);
        // 다른 열은 그대로: 두 열만 되돌리면 행 해시가 같다
        service.updateSetting(kfstest, new LeaveSettingReq(before.leaveYn(), before.leaveMonthCode()));
        assertThat(jdbc.queryForObject("select md5(t::text) from sys01_company t where sys01_company_id=28000", String.class)).isEqualTo(noteBefore);
    }
}
