package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** A10 회사별 메뉴맵핑 트리·저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysMenuService.class)
class CompanyMenuTreeDbTest {

    @Autowired SysMenuService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private static final long KFS = 28000L;

    /** AS-IS selectByCompanyIdAll을 부모 0부터 재귀로 돈 것과 같은 메뉴 수(루트에서 닿는 메뉴) */
    private int reachable() {
        return jdbc.queryForObject("with recursive t(id) as (select sys06_menu_id from sys06_menu where sys06_parent_id = 0 "
                + "union select m.sys06_menu_id from sys06_menu m join t on m.sys06_parent_id = t.id) select count(*) from t", Integer.class);
    }

    @Test
    void 트리는_루트에서_닿는_전체_메뉴이고_회사_연결_상태가_붙는다() {
        List<CompanyMenuTreeRes> tree = service.getCompanyMenuTree(sysAdmin, KFS);
        assertThat(tree).hasSize(reachable());
        assertThat(tree).extracting(CompanyMenuTreeRes::menuId).doesNotHaveDuplicates();
        assertThat(tree.get(0).depth()).isZero();
        // 전위 순서: 각 행의 부모는 앞에 있다
        java.util.Set<Long> seen = new java.util.HashSet<>(List.of(0L));
        tree.forEach(r -> { assertThat(seen).contains(r.parentId()); seen.add(r.menuId()); });
        long on = tree.stream().filter(r -> "true".equals(r.useYn())).count();
        int dbOn = jdbc.queryForObject("select count(distinct sys03_menu_id) from sys03_company_menu where sys03_company_id = ? and sys03_use_yn = 'true' "
                + "and sys03_menu_id in (with recursive t(id) as (select sys06_menu_id from sys06_menu where sys06_parent_id = 0 "
                + "union select m.sys06_menu_id from sys06_menu m join t on m.sys06_parent_id = t.id) select id from t)", Integer.class, KFS);
        assertThat(on).isEqualTo(dbOn);
    }

    @Test
    void 연결_없는_메뉴는_INSERT_있는_메뉴는_UPDATE() {
        List<CompanyMenuTreeRes> tree = service.getCompanyMenuTree(sysAdmin, KFS);
        CompanyMenuTreeRes none = tree.stream().filter(r -> r.companyMenuId() == null).findFirst().orElseThrow();
        CompanyMenuTreeRes has = tree.stream().filter(r -> r.companyMenuId() != null && "true".equals(r.useYn())).findFirst().orElseThrow();
        List<CompanyMenuTreeRes> saved = service.updateCompanyMenus(sysAdmin, KFS, List.of(
                new CompanyMenuSaveReq(none.menuId(), null, "true"),
                new CompanyMenuSaveReq(has.menuId(), has.companyMenuId(), "false")));
        assertThat(saved.get(0).companyMenuId()).isNotNull();
        assertThat(saved.get(0).useYn()).isEqualTo("true");
        assertThat(saved.get(1).useYn()).isEqualTo("false");
    }
}
