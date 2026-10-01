package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysMapper;
import kr.co.kfs.asseterp.oms.biz.user.dto.LoginAccount;
import lombok.RequiredArgsConstructor;
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
public class SysService {

    private static final long ROOT_MENU_ID = 0L;

    private final SysMapper sysMapper;

    /**
     * 로그인 사용자의 메뉴 트리. AS-IS MainFrame(1차, selectByHeaderMenu*) + MenuGrid(3차, selectByTailMenu*)를 한 번에 만든다.
     * 회사관리자는 회사 메뉴 전체, 사원은 권한그룹 메뉴만 본다.
     */
    public List<MenuRes.Level1> getMenus(UserPrincipal user) {
        boolean employee = LoginAccount.isEmployeeSessionId(user.getUserId());
        Long userId = employee ? user.getUserId() : null;

        List<MenuRow> level1Rows = employee
                ? sysMapper.searchHeaderMenusByUser(new MenuSearchParam(user.getCompanyId(), userId, ROOT_MENU_ID))
                : sysMapper.searchHeaderMenusByCompany(new MenuSearchParam(user.getCompanyId(), null, ROOT_MENU_ID));

        List<MenuRes.Level1> menus = new ArrayList<>();
        for (MenuRow level1 : level1Rows) {
            MenuSearchParam param = new MenuSearchParam(user.getCompanyId(), userId, level1.menuId());
            List<MenuRow> tailRows = employee
                    ? sysMapper.searchTailMenusByUser(param)
                    : sysMapper.searchTailMenusByCompany(param);
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
}
