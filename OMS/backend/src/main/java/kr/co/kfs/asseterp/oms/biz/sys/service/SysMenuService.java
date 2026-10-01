package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.service.EmpPersonService;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuBulkReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuUse;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyUseMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuCopyRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuCopySearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuGuideRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuGuideSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuGuideSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.TopMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PersonMenuParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PersonMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuUse;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysMenuMapper;
import kr.co.kfs.asseterp.oms.biz.user.dto.LoginAccount;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMenuService {

    private static final long ROOT_MENU_ID = 0L;

    private final SysMenuMapper sysMenuMapper;
    private final SysRoleService sysRoleService;
    private final EmpPersonService empPersonService;

    /**
     * 로그인 사용자의 메뉴 트리. AS-IS MainFrame(1차, selectByHeaderMenu*) + MenuGrid(3차, selectByTailMenu*)를 한 번에 만든다.
     * 회사관리자는 회사 메뉴 전체, 사원은 권한그룹 메뉴만 본다.
     */
    public List<MenuRes.Level1> getMenus(UserPrincipal user) {
        boolean employee = LoginAccount.isEmployeeSessionId(user.getUserId());
        Long userId = employee ? user.getUserId() : null;

        List<MenuRow> level1Rows = employee
                ? sysMenuMapper.searchHeaderMenusByUser(new MenuSearchParam(user.getCompanyId(), userId, ROOT_MENU_ID))
                : sysMenuMapper.searchHeaderMenusByCompany(new MenuSearchParam(user.getCompanyId(), null, ROOT_MENU_ID));

        List<MenuRes.Level1> menus = new ArrayList<>();
        for (MenuRow level1 : level1Rows) {
            MenuSearchParam param = new MenuSearchParam(user.getCompanyId(), userId, level1.menuId());
            List<MenuRow> tailRows = employee
                    ? sysMenuMapper.searchTailMenusByUser(param)
                    : sysMenuMapper.searchTailMenusByCompany(param);
            List<MenuRes.Level2> groups = toGroups(level1.menuId(), tailRows);
            if (!groups.isEmpty()) {
                menus.add(new MenuRes.Level1(String.valueOf(level1.menuId()), level1.menuNm(), groups));
            }
        }
        return menus;
    }

    /** 3차 메뉴를 상위(2차) 메뉴로 묶는다. 1차 바로 아래 행(2차 메뉴 자신)은 그룹 이름으로만 쓴다 */
    private List<MenuRes.Level2> toGroups(Long level1Id, List<MenuRow> rows) {
        Map<Long, List<MenuRow>> byParent = new LinkedHashMap<>();
        for (MenuRow row : rows) {
            if (!Objects.equals(row.parentId(), level1Id)) {
                byParent.computeIfAbsent(row.parentId(), k -> new ArrayList<>()).add(row);
            }
        }
        Comparator<List<MenuRow>> byParentSeq = Comparator.comparing(
                (List<MenuRow> items) -> items.get(0).parentSeq(), Comparator.nullsLast(Comparator.naturalOrder()));
        return byParent.values().stream()
                .sorted(byParentSeq)
                .map(items -> new MenuRes.Level2(
                        String.valueOf(items.get(0).parentId()),
                        items.get(0).parentMenuNm(),
                        items.stream()
                                .map(r -> new MenuRes.Level3(String.valueOf(r.menuId()), r.menuNm(), r.menuNo(), r.classNm()))
                                .toList()))
                .toList();
    }

    /**
     * AS-IS selectByRoleId: 회사 메뉴 트리 + 권한그룹 권한. AS-IS처럼 상위 메뉴마다 하위를 조회하고,
     * 트리 그리드가 바로 쓰도록 깊이 우선 순서의 평평한 목록(level 포함)으로 돌려준다.
     */
    public List<RoleMenuRes> searchRoleMenus(UserPrincipal user, Long roleId) {
        sysRoleService.requireRole(user, roleId);
        List<RoleMenuRes> result = new ArrayList<>();
        addRoleMenus(result, user.getCompanyId(), roleId, ROOT_MENU_ID, 0);
        return result;
    }

    /** companyId 회사 권한그룹의 메뉴 트리 (AS-IS Sys07_TapPage_Menu: KFS 관리자가 고른 회사) */
    public List<RoleMenuRes> searchCompanyRoleMenus(Long companyId, Long roleId) {
        List<RoleMenuRes> result = new ArrayList<>();
        addRoleMenus(result, companyId, roleId, ROOT_MENU_ID, 0);
        return result;
    }

    private void addRoleMenus(List<RoleMenuRes> result, Long companyId, Long roleId, Long parentId, int level) {
        for (RoleMenuRes menu : sysMenuMapper.searchRoleMenus(new RoleMenuSearchParam(companyId, roleId, parentId))) {
            result.add(menu.withLevel(level));
            addRoleMenus(result, companyId, roleId, menu.menuId(), level + 1);
        }
    }

    /** AS-IS updateRoleMenu: 바꾼 메뉴만 받아 sys07 행이 없으면 INSERT, 있으면 사용여부 UPDATE → 저장된 행(요청 순서) */
    @Transactional
    public List<RoleMenuUse> updateRoleMenus(UserPrincipal user, Long roleId, List<RoleMenuUse> rows) {
        return updateCompanyRoleMenus(user.getCompanyId(), roleId, rows);
    }

    /** companyId 회사 권한그룹의 메뉴 권한 저장 (AS-IS Sys07_Tab_CompanyRoleMenu: KFS 관리자가 고른 회사) */
    @Transactional
    public List<RoleMenuUse> updateCompanyRoleMenus(Long companyId, Long roleId, List<RoleMenuUse> rows) {
        sysRoleService.requireRole(companyId, roleId);
        List<RoleMenuUse> saved = new ArrayList<>(rows.size());
        for (RoleMenuUse req : rows) {
            String useYn = String.valueOf(req.roleMenuYn());
            Long id = req.roleMenuId();
            if (id == null) {
                id = sysMenuMapper.selectNextId();
                sysMenuMapper.insertRoleMenu(new RoleMenuRow(id, roleId, req.menuId(), useYn));
            } else {
                sysMenuMapper.updateRoleMenu(new RoleMenuRow(id, roleId, req.menuId(), useYn));
            }
            saved.add(new RoleMenuUse(req.menuId(), id, req.roleMenuYn()));
        }
        return saved;
    }

    /** AS-IS Sys06_Tab_MenuView → selectByCompanyId: 로그인 회사가 사용하는 메뉴 트리 (깊이 우선, level 포함) */
    public List<CompanyUseMenuRes> searchCompanyUseMenus(UserPrincipal user) {
        List<CompanyUseMenuRes> result = new ArrayList<>();
        addCompanyUseMenus(result, user.getCompanyId(), ROOT_MENU_ID, 0);
        return result;
    }

    private void addCompanyUseMenus(List<CompanyUseMenuRes> result, Long companyId, Long parentId, int level) {
        for (CompanyUseMenuRes menu : sysMenuMapper.searchCompanyUseMenus(new CompanyMenuSearchParam(companyId, parentId, null))) {
            result.add(menu.withLevel(level));
            addCompanyUseMenus(result, companyId, menu.menuId(), level + 1);
        }
    }

    // ── 메뉴 관리 (AS-IS Sys06_Tab_Menu) ──────────────────────────────

    /** AS-IS selectByAll: 전체 메뉴 트리 (깊이 우선, level 포함) */
    public List<MenuItemRes> searchMenuItems() {
        List<MenuItemRes> result = new ArrayList<>();
        addMenuItems(result, ROOT_MENU_ID, 0);
        return result;
    }

    private void addMenuItems(List<MenuItemRes> result, Long parentId, int level) {
        for (MenuItemRes menu : sysMenuMapper.searchMenuItems(parentId)) {
            result.add(menu.withLevel(level));
            addMenuItems(result, menu.menuId(), level + 1);
        }
    }

    /** AS-IS Sys06_Edit_Menu 신규 저장 (루트 메뉴는 parentId 0) */
    @Transactional
    public MenuItemRes createMenuItem(MenuItemSaveReq req) {
        validateMenuItem(req);
        Long menuId = sysMenuMapper.selectNextId();
        saveMenuItem(() -> sysMenuMapper.insertMenuItem(MenuItemRow.of(menuId, req)));
        return sysMenuMapper.selectMenuItem(menuId);
    }

    /** AS-IS Sys06_Edit_Menu 수정 / Sys06_Select_Menu 이동(parentId 변경) */
    @Transactional
    public MenuItemRes updateMenuItem(Long menuId, MenuItemSaveReq req) {
        validateMenuItem(req);
        if (menuId.equals(req.parentId())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "자기 자신 아래로 옮길 수 없습니다.");
        }
        saveMenuItem(() -> {
            if (sysMenuMapper.updateMenuItem(MenuItemRow.of(menuId, req)) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        });
        return sysMenuMapper.selectMenuItem(menuId);
    }

    /** AS-IS delete: 메뉴 행만 지운다 */
    @Transactional
    public int deleteMenuItem(Long menuId) {
        return sysMenuMapper.deleteMenuItem(menuId);
    }

    private void validateMenuItem(MenuItemSaveReq req) {
        if (req.menuNm() == null || req.menuNm().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "메뉴명을 입력하세요.");
        }
        if (req.parentId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상위 메뉴가 없습니다.");
        }
        // AS-IS insertChildMenu: 화면(클래스가 있는 메뉴)에는 하위 메뉴를 둘 수 없다
        if (req.parentId() != ROOT_MENU_ID) {
            MenuItemRes parent = sysMenuMapper.selectMenuItem(req.parentId());
            if (parent == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "상위 메뉴를 찾을 수 없습니다.");
            }
            if (parent.classNm() != null && !parent.classNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "오브젝트에는 하위 메뉴를 등록할 수 없습니다.");
            }
        }
    }

    private void saveMenuItem(Runnable save) {
        try {
            save.run();
        } catch (DuplicateKeyException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 화면번호입니다.");
        }
    }

    /** AS-IS getAllMenuList (일괄복사 메뉴 목록) */
    public List<MenuCopyRes> searchCopyMenus(String searchText, boolean menuNameYn) {
        return sysMenuMapper.searchCopyMenus(new MenuCopySearchParam(
                "%" + (searchText == null ? "" : searchText.trim()) + "%", String.valueOf(menuNameYn)));
    }

    // ── 화면안내등록 (AS-IS Sys06_Tab_MenuGuide) ──────────────────────

    /** AS-IS selectByMenuId: 3차 메뉴와 화면안내 */
    public List<MenuGuideRes> searchMenuGuides(Long menuId, String searchText) {
        return sysMenuMapper.searchMenuGuides(MenuGuideSearchParam.of(menuId, searchText));
    }

    /** AS-IS update(UpdateDataModel): 바꾼 행의 화면안내만 저장 → 저장된 값(요청 순서) */
    @Transactional
    public List<MenuGuideSaveReq> updateMenuGuides(List<MenuGuideSaveReq> rows) {
        for (MenuGuideSaveReq req : rows) {
            if (sysMenuMapper.updateMenuGuide(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows;
    }

    /** AS-IS sys00_common.selectMenuName (메뉴명 콤보) */
    public List<TopMenuRes> searchTopMenus() {
        return sysMenuMapper.searchTopMenus();
    }

    // ── 회사별 메뉴 (AS-IS Sys03_Tab_CompanyMenu) ─────────────────────

    /** AS-IS selectByCompanyIdAll: 전체 메뉴 트리 + 회사 사용 여부 */
    public List<CompanyMenuRes> searchCompanyMenus(Long companyId) {
        List<CompanyMenuRes> result = new ArrayList<>();
        addCompanyMenus(result, companyId, ROOT_MENU_ID, 0);
        return result;
    }

    private void addCompanyMenus(List<CompanyMenuRes> result, Long companyId, Long parentId, int level) {
        for (CompanyMenuRes menu : sysMenuMapper.searchCompanyMenus(new CompanyMenuSearchParam(companyId, parentId, null))) {
            result.add(menu.withLevel(level));
            addCompanyMenus(result, companyId, menu.menuId(), level + 1);
        }
    }

    /** AS-IS updateCompanyMenu: 바꾼 메뉴만 받아 sys03 행이 없으면 INSERT, 있으면 사용여부 UPDATE */
    @Transactional
    public List<CompanyMenuUse> updateCompanyMenus(Long companyId, List<CompanyMenuUse> rows) {
        List<CompanyMenuUse> saved = new ArrayList<>(rows.size());
        for (CompanyMenuUse req : rows) {
            String useYn = String.valueOf(req.companyMenuYn());
            Long id = req.companyMenuId();
            if (id == null) {
                id = sysMenuMapper.selectNextId();
                sysMenuMapper.insertCompanyMenu(new CompanyMenuRow(id, companyId, req.menuId(), useYn));
            } else {
                sysMenuMapper.updateCompanyMenu(new CompanyMenuRow(id, companyId, req.menuId(), useYn));
            }
            saved.add(new CompanyMenuUse(req.menuId(), id, req.companyMenuYn()));
        }
        return saved;
    }

    /**
     * AS-IS updateByMenuYn (일괄복사): 메뉴마다 상위 메뉴를 따라 올라가며 고객사별로 sys03 행이 없으면 INSERT,
     * 있으면 사용여부 UPDATE. 권한삭제(false)일 때는 같은 상위 아래 사용 중인 메뉴가 있으면 바꾸지 않는다 (AS-IS 그대로).
     */
    @Transactional
    public void updateCompanyMenusBulk(CompanyMenuBulkReq req) {
        String useYn = String.valueOf(req.useYn());
        for (Long menuId : req.menuIds()) {
            Long current = menuId;
            while (current != null) {
                MenuItemRes menu = sysMenuMapper.selectMenuItem(current);
                if (menu == null) {
                    break;
                }
                for (Long companyId : req.companyIds()) {
                    CompanyMenuSearchParam key = new CompanyMenuSearchParam(companyId, menu.parentId(), current);
                    if (sysMenuMapper.selectCompanyMenuId(key) == null) {
                        sysMenuMapper.insertCompanyMenu(new CompanyMenuRow(sysMenuMapper.selectNextId(), companyId, current, useYn));
                    } else if (req.useYn() || menu.parentId() == null || sysMenuMapper.countCompanyMenuUse(key) == 0) {
                        sysMenuMapper.updateCompanyMenuUse(new CompanyMenuRow(null, companyId, current, useYn));
                    }
                }
                current = menu.parentId();
            }
        }
    }

    /** AS-IS selectByPersonId (사원별 메뉴권한 View): 로그인 회사 사원만 */
    public List<PersonMenuRes> searchPersonMenus(UserPrincipal user, Long personId) {
        empPersonService.getPerson(user, personId);
        return sysMenuMapper.searchPersonMenus(new PersonMenuParam(user.getCompanyId(), personId));
    }
}
