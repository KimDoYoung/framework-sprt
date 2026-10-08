package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuService;
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

/** A06 권한그룹별 메뉴 맵핑 트리·저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysMenuService.class)
class RoleMenuTreeDbTest {

    @Autowired SysMenuService service;
    @Autowired JdbcTemplate jdbc;

    private static final long KFSTEST = 28000L;
    private static final long ROLE = 28118L; // kfstest 일반 사용자
    private final UserPrincipal kfstest = UserPrincipal.builder().userId(-1L).companyId(KFSTEST).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();

    /** AS-IS selectByRoleId를 부모 0부터 재귀로 돈 것과 같은 메뉴(회사 사용 메뉴 중 특정메뉴 아닌 것, 루트에서 닿는 것) */
    private static final String REACHABLE = "with recursive ok as (select sys06_menu_id id, sys06_parent_id pid from sys06_menu m "
            + "where exists (select 1 from sys03_company_menu c where c.sys03_menu_id = m.sys06_menu_id and c.sys03_company_id = ? "
            + "and coalesce(c.sys03_use_yn,'false') = 'true') and not exists (select 1 from sys50_specific_menu s "
            + "where s.sys50_company_id = ? and s.sys50_menu_id = m.sys06_menu_id)), "
            + "t(id) as (select id from ok where pid = 0 union select ok.id from ok join t on ok.pid = t.id) ";

    @Test
    void 트리는_AS_IS_재귀와_같은_메뉴이고_권한_연결_상태가_붙는다() {
        List<RoleMenuTreeRes> tree = service.getRoleMenuTree(kfstest, ROLE);
        int n = jdbc.queryForObject(REACHABLE + "select count(*) from t", Integer.class, KFSTEST, KFSTEST);
        assertThat(tree).hasSize(n);
        assertThat(tree).extracting(RoleMenuTreeRes::menuId).doesNotHaveDuplicates();
        java.util.Set<Long> seen = new java.util.HashSet<>(List.of(0L));
        tree.forEach(r -> { assertThat(seen).contains(r.parentId()); seen.add(r.menuId()); });
        long on = tree.stream().filter(r -> "true".equals(r.useYn())).count();
        int dbOn = jdbc.queryForObject(REACHABLE + "select count(*) from sys07_role_menu where sys07_role_id = ? and sys07_use_yn = 'true' "
                + "and sys07_menu_id in (select id from t)", Integer.class, KFSTEST, KFSTEST, ROLE);
        assertThat(on).isEqualTo(dbOn);
    }

    @Test
    void 연결_없는_메뉴는_INSERT_있는_메뉴는_UPDATE() {
        List<RoleMenuTreeRes> tree = service.getRoleMenuTree(kfstest, ROLE);
        RoleMenuTreeRes none = tree.stream().filter(r -> r.roleMenuId() == null).findFirst().orElseThrow();
        RoleMenuTreeRes has = tree.stream().filter(r -> r.roleMenuId() != null && "true".equals(r.useYn())).findFirst().orElseThrow();
        List<RoleMenuTreeRes> saved = service.updateRoleMenus(kfstest, ROLE, List.of(
                new RoleMenuSaveReq(none.menuId(), null, "true"),
                new RoleMenuSaveReq(has.menuId(), has.roleMenuId(), "false")));
        assertThat(saved.get(0).roleMenuId()).isNotNull();
        assertThat(saved.get(0).useYn()).isEqualTo("true");
        assertThat(saved.get(1).useYn()).isEqualTo("false");
    }

    @Test
    void 다른_회사의_권한그룹은_조회할_수_없다() {
        assertThatThrownBy(() -> service.getRoleMenuTree(other, ROLE)).isInstanceOf(BusinessException.class);
    }
}
