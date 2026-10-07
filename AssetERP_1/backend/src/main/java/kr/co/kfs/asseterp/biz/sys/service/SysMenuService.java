package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMenuMapper;
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

/** B06: 프레임 메뉴 트리만 (OMS SysMenuService에서 가져옴). 메뉴 관리 기능은 해당 A에서 추가한다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMenuService {

    private static final long ROOT_MENU_ID = 0L;

    private final SysMenuMapper sysMenuMapper;

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
        Map<Long, List<CompanyMenuTreeRes>> children = new LinkedHashMap<>();
        for (CompanyMenuTreeRes r : sysMenuMapper.selectCompanyMenuTree(companyId)) {
            children.computeIfAbsent(r.parentId(), k -> new ArrayList<>()).add(r); // SQL이 부모별 sys06_seq, sys06_menu_nm 순
        }
        List<CompanyMenuTreeRes> out = new ArrayList<>();
        addTree(out, children, ROOT_MENU_ID, 0, new java.util.HashSet<>());
        return out;
    }

    /** 부모에서 닿는 메뉴만(AS-IS도 parentId 0부터 내려가며 읽는다). 순환이 있으면 한 번만 */
    private void addTree(List<CompanyMenuTreeRes> out, Map<Long, List<CompanyMenuTreeRes>> children, Long parentId, int depth,
                         java.util.Set<Long> seen) {
        for (CompanyMenuTreeRes r : children.getOrDefault(parentId, List.of())) {
            if (!seen.add(r.menuId())) {
                continue;
            }
            out.add(r.withDepth(depth));
            addTree(out, children, r.menuId(), depth + 1, seen);
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

    /** 회사별 메뉴맵핑은 KFS 관리자만 (AS-IS는 메뉴가 admin 회사에만 있어서 막았다) */
    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
