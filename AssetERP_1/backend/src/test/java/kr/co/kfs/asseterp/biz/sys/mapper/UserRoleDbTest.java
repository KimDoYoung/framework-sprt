package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.TransPersonRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransService;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysUserRoleService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** A03 권한그룹별 사용자 맵핑: 조회·등록·중복·회사 조건·삭제를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysUserRoleService.class, EmpTransService.class})
class UserRoleDbTest {

    @Autowired SysUserRoleService service;
    @Autowired EmpTransService transService;
    @Autowired JdbcTemplate jdbc;

    private static final long KFSTEST = 28000L;
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(-1L).companyId(KFSTEST).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    private Long anyRole() {
        return jdbc.queryForObject("select sys04_role_id from sys04_role where sys04_company_id = ? order by sys04_role_id limit 1", Long.class, KFSTEST);
    }

    @Test
    void 조회는_권한그룹의_사원이고_다른_회사는_막는다() {
        Long role = anyRole();
        List<UserRoleRes> rows = service.searchUserRoles(kfstest, role);
        int linked = jdbc.queryForObject("select count(*) from sys05_user_role where sys05_role_id = ?", Integer.class, role);
        assertThat(rows.size()).isLessThanOrEqualTo(linked); // 발령 없는 사원은 원본 SQL처럼 빠진다
        assertThatThrownBy(() -> service.searchUserRoles(other, role)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 사원찾기로_고른_사원을_등록하고_중복은_막고_삭제한다() {
        Long role = anyRole();
        Set<Long> linked = service.searchUserRoles(kfstest, role).stream().map(UserRoleRes::userId).collect(Collectors.toSet());
        List<TransPersonRes> persons = transService.searchTransPersons(kfstest, "");
        assertThat(persons).isNotEmpty();
        TransPersonRes p = persons.stream().filter(x -> !linked.contains(x.personId())).findFirst().orElseThrow();

        List<UserRoleRes> saved = service.updateUserRoles(kfstest, List.of(new UserRoleSaveReq(-1L, p.personId(), role, p.orgCodeId())));
        assertThat(saved.get(0).empNo()).isEqualTo(p.empNo());
        assertThat(saved.get(0).authOrgId()).isEqualTo(p.orgCodeId());
        assertThatThrownBy(() -> service.updateUserRoles(kfstest, List.of(new UserRoleSaveReq(-1L, p.personId(), role, null))))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.updateUserRoles(other, List.of(new UserRoleSaveReq(-1L, p.personId(), role, null))))
                .isInstanceOf(BusinessException.class);

        assertThat(service.deleteUserRoles(other, List.of(saved.get(0).userRoleId()))).isZero();
        assertThat(service.deleteUserRoles(kfstest, List.of(saved.get(0).userRoleId()))).isEqualTo(1);
    }
}
