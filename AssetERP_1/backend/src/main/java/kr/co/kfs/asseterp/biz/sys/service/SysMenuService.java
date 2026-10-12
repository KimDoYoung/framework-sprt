package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuLinkRow;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuUseReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuCopyRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuCopySearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMenuMapper;
import kr.co.kfs.asseterp.biz.sys.mapper.SysRoleMapper;
import kr.co.kfs.asseterp.biz.user.dto.LoginAccount;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;

/** B06: 프레임 메뉴 트리만 (OMS SysMenuService에서 가져옴). 메뉴 관리 기능은 해당 A에서 추가한다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMenuService {

    private static final long ROOT_MENU_ID = 0L;

    private final SysMenuMapper sysMenuMapper;
    private final SysRoleMapper sysRoleMapper;

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

    // ── A10 회사별 메뉴맵핑 (AS-IS Sys06_Menu.selectByCompanyIdAll L83-116 / updateCompanyMenu L329-358) ──

    /** 전체 메뉴 트리(parentId 0부터) + 그 회사의 연결 상태 → 전위 순서 평평한 목록 */
    public List<CompanyMenuTreeRes> getCompanyMenuTree(UserPrincipal user, Long companyId) {
        requireSysAdmin(user);
        // SQL이 부모별 sys06_seq, sys06_menu_nm 순
        return toPreorder(sysMenuMapper.selectCompanyMenuTree(companyId), CompanyMenuTreeRes::menuId, CompanyMenuTreeRes::parentId,
                CompanyMenuTreeRes::withDepth);
    }

    /** 부모 순으로 정렬된 평평한 행 → parentId 0부터 전위 순서(depth 채움). 루트에서 닿는 메뉴만(AS-IS도 parentId 0부터 내려가며 읽는다) */
    private static <T> List<T> toPreorder(List<T> rows, Function<T, Long> id, Function<T, Long> parentId, BiFunction<T, Integer, T> withDepth) {
        Map<Long, List<T>> children = new LinkedHashMap<>();
        for (T r : rows) {
            children.computeIfAbsent(parentId.apply(r), k -> new ArrayList<>()).add(r);
        }
        List<T> out = new ArrayList<>();
        addTree(out, children, ROOT_MENU_ID, 0, new java.util.HashSet<>(), id, withDepth);
        return out;
    }

    /** 순환이 있으면 한 번만 */
    private static <T> void addTree(List<T> out, Map<Long, List<T>> children, Long parentId, int depth, java.util.Set<Long> seen,
                                    Function<T, Long> id, BiFunction<T, Integer, T> withDepth) {
        for (T r : children.getOrDefault(parentId, List.of())) {
            if (!seen.add(id.apply(r))) {
                continue;
            }
            out.add(withDepth.apply(r, depth));
            addTree(out, children, id.apply(r), depth + 1, seen, id, withDepth);
        }
    }

    /** 바뀐 행마다 연결 행이 없으면 채번해 INSERT, 있으면 use_yn UPDATE → 저장된 행(다시 조회하지 않는다 — AS-IS 그대로) */
    @Transactional
    public List<CompanyMenuTreeRes> updateCompanyMenus(UserPrincipal user, Long companyId, List<CompanyMenuSaveReq> rows) {
        requireSysAdmin(user);
        List<CompanyMenuTreeRes> saved = new ArrayList<>();
        for (CompanyMenuSaveReq r : rows) {
            if (r.companyMenuId() == null) {
                sysMenuMapper.insertCompanyMenu(sysMenuMapper.selectNextId(), companyId, r.menuId(), r.useYn());
            } else if (sysMenuMapper.updateCompanyMenuUseYn(r.companyMenuId(), companyId, r.useYn()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysMenuMapper.selectCompanyMenuNode(companyId, r.menuId()));
        }
        return saved;
    }

    // ── A06 권한그룹별 메뉴 맵핑 (AS-IS Sys06_Menu.selectByRoleId L120-160 / updateRoleMenu L296-327) ──

    /** 로그인 회사의 사용 메뉴(특정메뉴 제외) 트리 + 그 권한의 연결 상태 → 전위 순서 평평한 목록 */
    public List<RoleMenuTreeRes> getRoleMenuTree(UserPrincipal user, Long roleId) {
        requireOwnRole(user, roleId);
        // SQL이 부모별 sys06_seq, sys06_menu_id 순
        return toPreorder(sysMenuMapper.selectRoleMenuTree(user.getCompanyId(), roleId), RoleMenuTreeRes::menuId, RoleMenuTreeRes::parentId,
                RoleMenuTreeRes::withDepth);
    }

    /** 바뀐 행마다 연결 행이 없으면 채번해 INSERT, 있으면 use_yn UPDATE → 저장된 행(다시 조회하지 않는다 — AS-IS 그대로) */
    @Transactional
    public List<RoleMenuTreeRes> updateRoleMenus(UserPrincipal user, Long roleId, List<RoleMenuSaveReq> rows) {
        requireOwnRole(user, roleId);
        return saveRoleMenus(roleId, rows);
    }

    private List<RoleMenuTreeRes> saveRoleMenus(Long roleId, List<RoleMenuSaveReq> rows) {
        List<RoleMenuTreeRes> saved = new ArrayList<>();
        for (RoleMenuSaveReq r : rows) {
            if (r.roleMenuId() == null) {
                sysMenuMapper.insertRoleMenu(sysMenuMapper.selectNextId(), roleId, r.menuId(), r.useYn());
            } else if (sysMenuMapper.updateRoleMenuUseYn(r.roleMenuId(), roleId, r.useYn()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysMenuMapper.selectRoleMenuNode(roleId, r.menuId()));
        }
        return saved;
    }

    /** A08 Sys07_TapPage_Menu.retrieve(roleId, companyId) L88-113: 화면에서 고른 회사 기준 (A06과 같은 SQL, 회사만 다름) */
    public List<RoleMenuTreeRes> getCompanyRoleMenuTree(UserPrincipal user, Long companyId, Long roleId) {
        requireCompanyRole(user, companyId, roleId);
        return toPreorder(sysMenuMapper.selectRoleMenuTree(companyId, roleId), RoleMenuTreeRes::menuId, RoleMenuTreeRes::parentId,
                RoleMenuTreeRes::withDepth);
    }

    /** A07 Sys07_Tree_CompanyRoleMenu.update() L181-196: 고른 회사 권한으로 A06과 같은 저장 (AS-IS sys.Sys06_Menu.updateRoleMenu(roleId)) */
    @Transactional
    public List<RoleMenuTreeRes> updateCompanyRoleMenus(UserPrincipal user, Long companyId, Long roleId, List<RoleMenuSaveReq> rows) {
        requireCompanyRole(user, companyId, roleId);
        return saveRoleMenus(roleId, rows);
    }

    // ── A09 메뉴 관리 (AS-IS Sys06_Menu.selectByAll L24 / update L633 / delete L638 / getAllMenuList L477 / updateByMenuYn L572) ──

    /** 전체 메뉴 트리(parentId 0부터) → 전위 순서 평평한 목록 */
    public List<MenuTreeRes> getMenuTree(UserPrincipal user) {
        requireSysAdmin(user);
        return toPreorder(sysMenuMapper.selectMenuTree(), MenuTreeRes::menuId, MenuTreeRes::parentId, MenuTreeRes::withDepth);
    }

    /** 매뉴 등록 (AS-IS insertMenu: 클라이언트가 getSeq로 받던 ID를 서버가 채번) → 저장된 행 */
    @Transactional
    public MenuTreeRes createMenu(UserPrincipal user, MenuSaveReq req) {
        requireSysAdmin(user);
        MenuSaveReq row = req.withMenuId(sysMenuMapper.selectNextId());
        checkMenu(row);
        sysMenuMapper.insertMenu(row);
        return sysMenuMapper.selectMenuNode(row.menuId());
    }

    /** 매뉴 수정·이동 (AS-IS UpdateDataModel UPDATE → selectById) */
    @Transactional
    public MenuTreeRes updateMenu(UserPrincipal user, Long menuId, MenuSaveReq req) {
        requireSysAdmin(user);
        MenuSaveReq row = req.withMenuId(menuId);
        checkMenu(row);
        if (sysMenuMapper.updateMenu(row) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return sysMenuMapper.selectMenuNode(menuId);
    }

    /** 원본은 DB 오류(not null·unique·길이)로 실패하던 것을 미리 막는다(05 §6 DB 오류) */
    private void checkMenu(MenuSaveReq r) {
        if (r.menuNm() == null || r.menuNm().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "매뉴명을 입력하세요.");
        }
        if (r.parentId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상위 매뉴가 없습니다.");
        }
        if (r.menuNo() != null) {
            if (r.menuNo().length() > 4) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "화면번호는 4자까지입니다.");
            }
            if (sysMenuMapper.countByMenuNo(r.menuNo(), r.menuId()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 사용 중인 화면번호입니다: " + r.menuNo());
            }
        }
    }

    /** 매뉴 삭제 (AS-IS deleteModel: ID로만 — 자식·연결 행은 남는다) → 지운 건수 */
    @Transactional
    public int deleteMenu(UserPrincipal user, Long menuId) {
        requireSysAdmin(user);
        return sysMenuMapper.deleteMenu(menuId);
    }

    /** 일괄복사 매뉴 목록 (AS-IS retrieve01: '%' + 검색어 + '%', 매뉴명만 검색) */
    public List<MenuCopyRes> searchCopyMenus(UserPrincipal user, String searchText, boolean menuNameYn) {
        requireSysAdmin(user);
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return sysMenuMapper.selectCopyMenus(new MenuCopySearchParam(like, String.valueOf(menuNameYn)));
    }

    /**
     * 일괄 권한부여·삭제 (AS-IS updateByMenuYn L572-631 그대로): 고른 메뉴마다 부모 쪽으로 올라가며(루트 0에서 멈춤) 고른 회사마다
     * 연결이 없으면 채번해 INSERT(useYn), 있으면 use_yn UPDATE. 삭제(false)일 때는 그 메뉴의 부모 아래 사용 중 연결이 있으면 바꾸지 않는다
     * (countUseYn에 menuId 조건이 없어 자기 자신도 센다 — 원본 그대로, 작업기록 제안)
     */
    @Transactional
    public void updateCompanyMenuUse(UserPrincipal user, CompanyMenuUseReq req) {
        requireSysAdmin(user);
        if (req.menuIds() == null || req.menuIds().isEmpty() || req.companyIds() == null || req.companyIds().isEmpty()
                || req.useYn() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        boolean useYn = req.useYn();
        String use = String.valueOf(useYn);
        for (Long menuId : req.menuIds()) {
            Long currentMenuId = menuId;
            while (currentMenuId != null) {
                MenuTreeRes menu = sysMenuMapper.selectMenuNode(currentMenuId);
                if (menu == null) {
                    break;
                }
                for (Long companyId : req.companyIds()) {
                    CompanyMenuLinkRow link = sysMenuMapper.selectCompanyMenuLink(currentMenuId, companyId);
                    if (link == null) {
                        throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                    }
                    if (link.companyMenuId() == null) {
                        sysMenuMapper.insertCompanyMenu(sysMenuMapper.selectNextId(), companyId, currentMenuId, use);
                    } else {
                        boolean updateParent = true;
                        if (!useYn && menu.parentId() != null
                                && sysMenuMapper.countCompanyMenuUseYn(menu.parentId(), companyId) > 0) {
                            updateParent = false;
                        }
                        if (updateParent) {
                            sysMenuMapper.updateCompanyMenuUseYnByMenu(currentMenuId, companyId, use);
                        }
                    }
                }
                currentMenuId = menu.parentId(); // 부모 메뉴로 이동
            }
        }
    }

    /** sys admin이고 권한그룹이 그 회사 것인지 (A07·A08 — 메뉴가 admin 회사에만 있다) */
    private void requireCompanyRole(UserPrincipal user, Long companyId, Long roleId) {
        requireSysAdmin(user);
        RoleRes role = sysRoleMapper.selectRole(roleId);
        if (role == null || !Objects.equals(role.companyId(), companyId)) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** 권한그룹이 로그인 회사 것인지 (AS-IS는 화면이 자기 회사 권한만 보여 줘서 검사하지 않았다 — 05 §6 회사 조건) */
    private void requireOwnRole(UserPrincipal user, Long roleId) {
        RoleRes role = sysRoleMapper.selectRole(roleId);
        if (role == null || !Objects.equals(role.companyId(), user.getCompanyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** 회사별 메뉴맵핑·메뉴 관리는 KFS 관리자만 (AS-IS는 메뉴가 admin 회사에만 있어서 막았다) */
    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
