package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuUseReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuYnRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuYnSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** A09 메뉴 관리(트리·등록·수정·삭제·일괄 권한·회사 그리드 저장)를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysMenuService.class, SysCompanyService.class})
class MenuAdminDbTest {

    @Autowired SysMenuService service;
    @Autowired SysCompanyService companyService;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private static final long KFS = 28000L;

    private MenuSaveReq req(Long parentId, String nm, String menuNo) {
        return new MenuSaveReq(null, nm, "99", "insert menu", parentId, "false", null, null, "false", "false", null, menuNo);
    }

    private int links(long companyId, long menuId) {
        return jdbc.queryForObject("select count(*) from sys03_company_menu where sys03_company_id = ? and sys03_menu_id = ?",
                Integer.class, companyId, menuId);
    }

    @Test
    void 트리는_루트에서_닿는_전체_메뉴_전위_순서() {
        List<MenuTreeRes> tree = service.getMenuTree(sysAdmin);
        int reachable = jdbc.queryForObject("with recursive t(id) as (select sys06_menu_id from sys06_menu where sys06_parent_id = 0 "
                + "union select m.sys06_menu_id from sys06_menu m join t on m.sys06_parent_id = t.id) select count(*) from t", Integer.class);
        assertThat(tree).hasSize(reachable);
        Set<Long> seen = new HashSet<>(List.of(0L));
        tree.forEach(r -> { assertThat(seen).contains(r.parentId()); seen.add(r.menuId()); });
        assertThat(tree).allSatisfy(r -> assertThat(r.useYn()).isIn("true", "false"));
    }

    @Test
    void 등록_수정_이동_삭제() {
        MenuTreeRes root = service.createMenu(sysAdmin, req(0L, "A09시험루트", null));
        assertThat(root.menuId()).isPositive();
        assertThat(root.note()).isEqualTo("insert menu");
        MenuTreeRes child = service.createMenu(sysAdmin, req(root.menuId(), "A09시험하위", null));
        MenuTreeRes other = service.createMenu(sysAdmin, req(0L, "A09시험루트2", null));

        // 수정: 모든 칸
        MenuTreeRes edited = service.updateMenu(sysAdmin, child.menuId(), new MenuSaveReq(null, "A09수정", "1", "안내", root.menuId(),
                "true", "Xxx_Tab", "비고", "true", "true", "Mobi", null));
        assertThat(edited.menuNm()).isEqualTo("A09수정");
        assertThat(edited.useYn()).isEqualTo("true");
        assertThat(edited.classNm()).isEqualTo("Xxx_Tab");
        assertThat(edited.mobiClassNm()).isEqualTo("Mobi");

        // 이동 = parentId만 바꾼 저장
        MenuTreeRes moved = service.updateMenu(sysAdmin, child.menuId(), new MenuSaveReq(null, edited.menuNm(), edited.seq(),
                edited.note(), other.menuId(), edited.useYn(), edited.classNm(), edited.menualUrl(), edited.addTitleUseYn(),
                edited.mobiUseYn(), edited.mobiClassNm(), edited.menuNo()));
        assertThat(moved.parentId()).isEqualTo(other.menuId());

        assertThat(service.deleteMenu(sysAdmin, child.menuId())).isEqualTo(1);
        assertThat(service.deleteMenu(sysAdmin, child.menuId())).isZero();
    }

    @Test
    void 화면번호_중복과_매뉴명_빈값은_막는다() {
        String used = jdbc.queryForObject("select sys06_menu_no from sys06_menu where sys06_menu_no is not null limit 1", String.class);
        assertThatThrownBy(() -> service.createMenu(sysAdmin, req(0L, "A09시험", used))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.createMenu(sysAdmin, req(0L, " ", null))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 일괄_권한부여는_부모쪽으로_올라가며_연결을_만든다() {
        MenuTreeRes root = service.createMenu(sysAdmin, req(0L, "A09시험루트", null));
        MenuTreeRes mid = service.createMenu(sysAdmin, req(root.menuId(), "A09시험중간", null));
        MenuTreeRes leaf = service.createMenu(sysAdmin, req(mid.menuId(), "A09시험말단", null));

        service.updateCompanyMenuUse(sysAdmin, new CompanyMenuUseReq(List.of(leaf.menuId()), List.of(KFS), true));
        for (Long id : List.of(leaf.menuId(), mid.menuId(), root.menuId())) {
            assertThat(jdbc.queryForObject("select sys03_use_yn from sys03_company_menu where sys03_company_id = ? and sys03_menu_id = ?",
                    String.class, KFS, id)).isEqualTo("true");
        }
        // 다시 부여해도 행이 늘지 않는다(있으면 UPDATE)
        service.updateCompanyMenuUse(sysAdmin, new CompanyMenuUseReq(List.of(leaf.menuId()), List.of(KFS), true));
        assertThat(links(KFS, leaf.menuId())).isEqualTo(1);

        // 권한삭제: 원본 countUseYn이 자기 자신(사용 중)도 세므로 바뀌지 않는다 — 원본 동작 그대로
        service.updateCompanyMenuUse(sysAdmin, new CompanyMenuUseReq(List.of(leaf.menuId()), List.of(KFS), false));
        assertThat(jdbc.queryForObject("select sys03_use_yn from sys03_company_menu where sys03_company_id = ? and sys03_menu_id = ?",
                String.class, KFS, leaf.menuId())).isEqualTo("true");
    }

    @Test
    void 회사_그리드_저장은_true면_INSERT_false면_DELETE_결과는_전체_회사() {
        MenuTreeRes menu = service.createMenu(sysAdmin, req(0L, "A09시험루트", null));
        List<CompanyMenuYnRes> before = companyService.searchCompanyMenuYn(sysAdmin, menu.menuId(), null);
        assertThat(before).isNotEmpty().allSatisfy(r -> assertThat(r.menuYn()).isEqualTo("false"));

        List<CompanyMenuYnRes> saved = companyService.updateCompanyMenuYn(sysAdmin, menu.menuId(),
                List.of(new CompanyMenuYnSaveReq(KFS, null, "true")));
        CompanyMenuYnRes kfs = saved.stream().filter(r -> r.companyId() == KFS).findFirst().orElseThrow();
        assertThat(kfs.menuYn()).isEqualTo("true");
        assertThat(kfs.companyMenuId()).isNotNull();
        assertThat(saved).hasSize(jdbc.queryForObject("select count(*) from sys01_company where sys01_use_yn = 'true'", Integer.class));

        companyService.updateCompanyMenuYn(sysAdmin, menu.menuId(), List.of(new CompanyMenuYnSaveReq(KFS, kfs.companyMenuId(), "false")));
        assertThat(links(KFS, menu.menuId())).isZero();
    }
}
