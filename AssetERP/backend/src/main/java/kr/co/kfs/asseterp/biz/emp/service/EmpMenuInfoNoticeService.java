package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MenuInfoNoticeRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpMenuInfoNoticeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp91_MenuInfoNotice.java (selectByText·updatePersonId L52-82·deletePersonId·delete L107) — Emp91_Lookup_List (EE62) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpMenuInfoNoticeService {

    /** 메뉴ID 0 = 화면안내 전체 비활성 (emp91_menu_id 컬럼 설명 "0입력시, 전체 false") */
    private static final long ALL_MENU = 0L;

    private final EmpMenuInfoNoticeMapper mapper;

    /** AS-IS retrieve() L208-219: 검색어는 '%검색어%' */
    public List<MenuInfoNoticeRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByText(user.getUserId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS LoginUser.getMenuInfoYn() 의 반대: 전체 차단 행이 있는가 */
    public boolean isAllBlocked(UserPrincipal user) {
        return mapper.countByMenuId(user.getUserId(), ALL_MENU) > 0;
    }

    /** AS-IS 체크박스 ValueChange L101-138: 켜면 updatePersonId(menuId 0) — 없으면 넣고 있으면 날짜 갱신, 끄면 deletePersonId(menuId 0) */
    @Transactional
    public void setAllBlocked(UserPrincipal user, boolean blocked) {
        if (!blocked) {
            mapper.deleteByMenuId(user.getUserId(), ALL_MENU);
        } else if (mapper.countByMenuId(user.getUserId(), ALL_MENU) == 0) {
            mapper.insert(user.getUserId(), ALL_MENU);
        } else {
            mapper.updateDate(user.getUserId(), ALL_MENU);
        }
    }

    /** AS-IS deleteRow() L221-225 → emp.Emp91_MenuInfoNotice.delete (본인 행만) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getUserId(), ids);
    }
}
