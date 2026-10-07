package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRes;
import kr.co.kfs.asseterp.biz.sys.service.SysAdminUserMenuService;
import kr.co.kfs.asseterp.biz.sys.service.SysUserService;
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

/** A15 고객별 관리자(Sys02)·권한설정(Sys82)을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysUserService.class, SysAdminUserMenuService.class})
class AdminUserDbTest {

    @Autowired SysUserService userService;
    @Autowired SysAdminUserMenuService menuService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private static final long KFS = 28000L;

    @Test
    void 관리자를_등록하면_비밀번호가_암호화되고_로그인_SQL처럼_풀린다() {
        List<AdminUserRes> saved = userService.updateUsers(sysAdmin, KFS,
                List.of(new AdminUserReq(-1L, "ZZ_A15_관리자", "zza15admin", "1111", null, null, null, null, "true")));
        AdminUserRes u = saved.get(0);
        assertThat(u.decPasswd()).isEqualTo("1111");
        String stored = jdbc.queryForObject("select sys02_passwd from sys02_user where sys02_user_id = ?", String.class, u.userId());
        assertThat(stored).isNotEqualTo("1111");
        // AccountMapper.managerSelect와 같은 식(TO_DECRYPTS)으로 로그인 비교값이 나온다
        assertThat(jdbc.queryForObject("select to_decrypts(sys02_passwd) from sys02_user where sys02_user_id = ?", String.class, u.userId()))
                .isEqualTo("1111");

        // 비밀번호를 비워 저장하면 그대로 둔다(AS-IS: decPasswd가 null이면 암호화하지 않고 기존 값)
        userService.updateUsers(sysAdmin, KFS, List.of(new AdminUserReq(u.userId(), "ZZ_A15_관리자2", "zza15admin", null, null, null, null, null, "true")));
        assertThat(jdbc.queryForObject("select sys02_passwd from sys02_user where sys02_user_id = ?", String.class, u.userId())).isEqualTo(stored);

        assertThatThrownBy(() -> userService.updateUsers(sysAdmin, KFS,
                List.of(new AdminUserReq(-2L, "다른", "zza15admin", "1", null, null, null, null, "true"))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("이미 사용 중인 ID");
        assertThat(userService.deleteUsers(sysAdmin, KFS, List.of(u.userId()))).isEqualTo(1);
    }

    @Test
    void 권한설정_트리는_admin_회사_메뉴이고_저장하면_sys82가_생긴다() {
        AdminUserRes u = userService.updateUsers(sysAdmin, KFS,
                List.of(new AdminUserReq(-1L, "ZZ_A15_관리자", "zza15admin", "1111", null, null, null, null, "false"))).get(0);
        List<AdminUserMenuRes> tree = menuService.searchMenus(sysAdmin, u.userId());
        int adminMenus = jdbc.queryForObject("select count(*) from sys03_company_menu c join sys06_menu m on m.sys06_menu_id = c.sys03_menu_id "
                + "where c.sys03_company_id = 0 and m.sys06_use_yn = 'true'", Integer.class);
        assertThat(tree.size()).isLessThanOrEqualTo(adminMenus).isPositive(); // 상위가 끊긴 메뉴는 트리에 안 나온다
        assertThat(tree.get(0).depth()).isZero();
        assertThat(tree).allMatch(m -> m.useYn() == null);

        AdminUserMenuRes first = tree.get(0);
        List<AdminUserMenuRes> saved = menuService.updateMenus(sysAdmin, u.userId(), List.of(new AdminUserMenuReq(first.menuId(), null, "true")));
        assertThat(saved.get(0).useYn()).isEqualTo("true");
        assertThat(saved.get(0).adminUserMenuId()).isNotNull();
        menuService.updateMenus(sysAdmin, u.userId(), List.of(new AdminUserMenuReq(first.menuId(), saved.get(0).adminUserMenuId(), "false")));
        assertThat(menuService.searchMenus(sysAdmin, u.userId()).get(0).useYn()).isEqualTo("false");
    }
}
