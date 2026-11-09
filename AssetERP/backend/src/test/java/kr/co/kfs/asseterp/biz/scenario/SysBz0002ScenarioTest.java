package kr.co.kfs.asseterp.biz.scenario;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.biz.sys.service.SysUserService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 업무 시나리오 SYS-BZ-0002 고객사 관리자 발급 (docs/2-업무분석/biz-event/SYS/SYS-BZ-0002-고객사관리자발급.md).
 * #1075 [고객별 관리자] 탭의 [등록] → 행 입력 → [저장]을 서비스 순서대로 부른다. 끝나면 롤백한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCompanyService.class, SysUserService.class})
@DisplayName("SYS-BZ-0002 고객사 관리자 발급")
class SysBz0002ScenarioTest {

    @Autowired SysCompanyService companyService;
    @Autowired SysUserService userService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal kfsAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private long newCompany() {
        return companyService.createCompany(kfsAdmin,
                new CompanyCreateReq("(주)시나리오시험", "bztest", "1111", LocalDate.of(2020, 3, 2), null, "999-99-99999", "12", "3", "12")).companyId();
    }

    private AdminUserReq admin(String loginId, String adminYn) {
        return new AdminUserReq(null, "관리자", loginId, "1111", "admin@kalpa.test", "010-0000-0000", "02-000-0000", "가상회사", adminYn);
    }

    @Test
    @DisplayName("[저장] → 관리자 행이 생기고 비밀번호는 암호화돼 저장되며, 화면에는 복호화해 보인다")
    void 관리자를_발급한다() {
        long cid = newCompany();
        assertThat(jdbc.queryForObject("select count(*) from sys02_user where sys02_company_id = ?", Integer.class, cid)).isZero();

        List<AdminUserRes> saved = userService.updateUsers(kfsAdmin, cid, List.of(admin("admin", "true")));

        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).loginId()).isEqualTo("admin");
        assertThat(saved.get(0).decPasswd()).isEqualTo("1111");
        assertThat(saved.get(0).adminYn()).isEqualTo("true");
        String stored = jdbc.queryForObject("select sys02_passwd from sys02_user where sys02_company_id = ?", String.class, cid);
        assertThat(stored).isNotEqualTo("1111");                                    // 평문이 아니다
        assertThat(userService.searchUsers(kfsAdmin, cid)).hasSize(1);
    }

    @Test
    @DisplayName("전체권한을 끄면(adminYn=false) 그 관리자에게 체크한 메뉴만 보인다 — 여기서는 값만 저장된다")
    void 전체권한을_끈다() {
        long cid = newCompany();
        List<AdminUserRes> saved = userService.updateUsers(kfsAdmin, cid, List.of(admin("sub", "false")));
        assertThat(saved.get(0).adminYn()).isEqualTo("false");
    }

    @Test
    @DisplayName("규칙: 사용자명 필수, 같은 회사 안에서 ID 중복 불가, KFS 관리자만 가능")
    void 막히는_경우() {
        long cid = newCompany();
        assertThatThrownBy(() -> userService.updateUsers(kfsAdmin, cid,
                List.of(new AdminUserReq(null, "", "admin", "1111", null, null, null, null, "true"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("사용자명");
        userService.updateUsers(kfsAdmin, cid, List.of(admin("admin", "true")));
        assertThatThrownBy(() -> userService.updateUsers(kfsAdmin, cid, List.of(admin("admin", "true"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("이미 사용 중인 ID");
        UserPrincipal staff = UserPrincipal.builder().userId(1L).companyId(cid).roles(List.of("ROLE_USER")).build();
        assertThatThrownBy(() -> userService.updateUsers(staff, cid, List.of(admin("x", "true"))))
                .isInstanceOf(BusinessException.class);
    }
}
