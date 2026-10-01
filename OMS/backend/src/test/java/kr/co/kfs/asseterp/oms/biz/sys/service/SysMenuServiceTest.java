package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuBulkReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuUse;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysMenuMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SysMenuServiceTest {

    private final SysMenuMapper sysMenuMapper = mock(SysMenuMapper.class);
    private final SysRoleService sysRoleService = mock(SysRoleService.class);
    private final SysMenuService sysMenuService = new SysMenuService(sysMenuMapper, sysRoleService, mock(kr.co.kfs.asseterp.oms.biz.emp.service.EmpPersonService.class));

    private static UserPrincipal user(long userId) {
        return UserPrincipal.builder().userId(userId).companyId(28000L).roles(List.of()).build();
    }

    private static MenuRow row(long id, String nm, String seq, long parentId, String parentNm, String parentSeq) {
        return new MenuRow(id, nm, "M" + id, seq, parentId, "Cls" + id, parentNm, parentSeq);
    }

    @Test
    void 사원은_권한그룹_메뉴로_3단계_트리를_만든다() {
        when(sysMenuMapper.searchHeaderMenusByUser(any())).thenReturn(List.of(row(1, "경영관리", "1000", 0, null, null)));
        // 3차 메뉴는 item seq 순으로 오지만 그룹은 상위(2차) seq 순으로 정렬한다
        when(sysMenuMapper.searchTailMenusByUser(any())).thenReturn(List.of(
                row(21, "사원조회", "1", 20, "사원관리", "2000"),
                row(11, "조직등록", "2", 10, "조직관리", "1000"),
                row(22, "사원등록", "3", 20, "사원관리", "2000")));

        List<MenuRes.Level1> menus = sysMenuService.getMenus(user(101));

        assertThat(menus).hasSize(1);
        assertThat(menus.get(0).groups()).extracting(MenuRes.Level2::groupTitle).containsExactly("조직관리", "사원관리");
        assertThat(menus.get(0).groups().get(1).items()).extracting(MenuRes.Level3::title).containsExactly("사원조회", "사원등록");
        verify(sysMenuMapper).searchTailMenusByUser(new MenuSearchParam(28000L, 101L, 1L));
        verify(sysMenuMapper, never()).searchHeaderMenusByCompany(any());
    }

    @Test
    void 회사관리자는_회사_메뉴를_보고_2차_메뉴_행은_그룹으로만_쓴다() {
        when(sysMenuMapper.searchHeaderMenusByCompany(any())).thenReturn(List.of(
                row(1, "관리자", "9000", 0, null, null),
                row(2, "빈메뉴", "9500", 0, null, null)));
        when(sysMenuMapper.searchTailMenusByCompany(new MenuSearchParam(28000L, null, 1L))).thenReturn(List.of(
                row(10, "고객관리", "1", 1, "관리자", "9000"),
                row(11, "메뉴 관리", "1", 10, "고객관리", "1")));
        when(sysMenuMapper.searchTailMenusByCompany(new MenuSearchParam(28000L, null, 2L))).thenReturn(List.of());

        // 회사관리자 세션 ID는 음수 (-sys02_user_id)
        List<MenuRes.Level1> menus = sysMenuService.getMenus(user(-5));

        assertThat(menus).extracting(MenuRes.Level1::title).containsExactly("관리자"); // 하위 메뉴 없는 1차는 뺀다
        assertThat(menus.get(0).groups()).singleElement().satisfies(g -> {
            assertThat(g.groupTitle()).isEqualTo("고객관리");
            assertThat(g.items()).extracting(MenuRes.Level3::code).containsExactly("11");
        });
        verify(sysMenuMapper, never()).searchHeaderMenusByUser(any());
    }

    private static RoleMenuRes menu(long id, long parentId) {
        return new RoleMenuRes(id, parentId, 0, "M" + id, null, null, null, false);
    }

    @Test
    void 권한그룹_메뉴는_깊이_우선_순서와_level로_펼친다() {
        when(sysMenuMapper.searchRoleMenus(any())).thenReturn(List.of());
        when(sysMenuMapper.searchRoleMenus(new RoleMenuSearchParam(28000L, 5L, 0L))).thenReturn(List.of(menu(1, 0), menu(2, 0)));
        when(sysMenuMapper.searchRoleMenus(new RoleMenuSearchParam(28000L, 5L, 1L))).thenReturn(List.of(menu(11, 1)));
        when(sysMenuMapper.searchRoleMenus(new RoleMenuSearchParam(28000L, 5L, 11L))).thenReturn(List.of(menu(111, 11)));

        List<RoleMenuRes> rows = sysMenuService.searchRoleMenus(user(-1), 5L);

        assertThat(rows).extracting(RoleMenuRes::menuId).containsExactly(1L, 11L, 111L, 2L);
        assertThat(rows).extracting(RoleMenuRes::level).containsExactly(0, 1, 2, 0);
        verify(sysRoleService).requireRole(any(UserPrincipal.class), eq(5L));
    }

    @Test
    void 권한그룹_메뉴_저장은_행이_없으면_INSERT_있으면_UPDATE() {
        when(sysMenuMapper.selectNextId()).thenReturn(900L);

        List<RoleMenuUse> saved = sysMenuService.updateRoleMenus(user(-1), 5L, List.of(
                new RoleMenuUse(11L, null, true), new RoleMenuUse(12L, 70L, false)));

        verify(sysMenuMapper).insertRoleMenu(new RoleMenuRow(900L, 5L, 11L, "true"));
        verify(sysMenuMapper).updateRoleMenu(new RoleMenuRow(70L, 5L, 12L, "false"));
        assertThat(saved).extracting(RoleMenuUse::roleMenuId).containsExactly(900L, 70L);
    }

    private static MenuItemRes item(long id, long parentId, String classNm) {
        return new MenuItemRes(id, parentId, 0, "M" + id, classNm, null, true, null, null, null);
    }

    @Test
    void 화면_메뉴_아래에는_하위_메뉴를_만들_수_없다() {
        when(sysMenuMapper.selectMenuItem(10L)).thenReturn(item(10, 1, "Sys04_Tab_Role"));
        assertThatThrownBy(() -> sysMenuService.createMenuItem(new MenuItemSaveReq(10L, "x", null, null, null, true, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("오브젝트");
        verify(sysMenuMapper, never()).insertMenuItem(any());
    }

    @Test
    void 일괄_권한부여는_상위_메뉴까지_올라가며_없으면_INSERT_있으면_UPDATE() {
        // 111 → 11 → 1 → (0: 없음)
        when(sysMenuMapper.selectMenuItem(111L)).thenReturn(item(111, 11, "Cls"));
        when(sysMenuMapper.selectMenuItem(11L)).thenReturn(item(11, 1, null));
        when(sysMenuMapper.selectMenuItem(1L)).thenReturn(item(1, 0, null));
        when(sysMenuMapper.selectCompanyMenuId(any())).thenReturn(null);
        when(sysMenuMapper.selectCompanyMenuId(new kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuSearchParam(28000L, 0L, 1L))).thenReturn(500L);
        when(sysMenuMapper.selectNextId()).thenReturn(900L, 901L);

        sysMenuService.updateCompanyMenusBulk(new CompanyMenuBulkReq(List.of(111L), List.of(28000L), true));

        verify(sysMenuMapper).insertCompanyMenu(new CompanyMenuRow(900L, 28000L, 111L, "true"));
        verify(sysMenuMapper).insertCompanyMenu(new CompanyMenuRow(901L, 28000L, 11L, "true"));
        verify(sysMenuMapper).updateCompanyMenuUse(new CompanyMenuRow(null, 28000L, 1L, "true"));
    }

    @Test
    void 일괄_권한삭제는_같은_상위_아래_사용_메뉴가_있으면_바꾸지_않는다() {
        when(sysMenuMapper.selectMenuItem(111L)).thenReturn(item(111, 11, "Cls"));
        when(sysMenuMapper.selectMenuItem(11L)).thenReturn(null);
        when(sysMenuMapper.selectCompanyMenuId(any())).thenReturn(500L);
        when(sysMenuMapper.countCompanyMenuUse(any())).thenReturn(1);

        sysMenuService.updateCompanyMenusBulk(new CompanyMenuBulkReq(List.of(111L), List.of(28000L), false));

        verify(sysMenuMapper, never()).updateCompanyMenuUse(any());
    }
}
