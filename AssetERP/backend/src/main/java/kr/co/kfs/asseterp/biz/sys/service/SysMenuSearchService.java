package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMenuSearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys06_Menu.java (selectByTextManager L452, selectByText L470) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMenuSearchService {

    private final SysMenuSearchMapper mapper;

    /**
     * AS-IS Sys06_Lookup_SearchMenu.retrieve() L217-242: 회사관리자(userId &lt; 0)나 관리자 회사(0)는 selectByTextManager, 그 밖에는 selectByText.
     * companyId는 관리자 회사만 다른 회사를 고를 수 있다. 관리자 쪽 SQL은 원본이 userId를 넘기지 않아 null로 부른다
     */
    public List<MenuSearchRes> search(UserPrincipal user, Long companyId, String searchText, boolean menuNameYn) {
        Long company = user.companyOf(companyId);
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        String yn = String.valueOf(menuNameYn);
        if (isManager(user)) {
            return mapper.selectByTextManager(null, company, text, yn);
        }
        return mapper.selectByText(user.getUserId(), company, text, yn);
    }

    /** AS-IS LoginUser.getIsManager() || companyId == 0 (회사관리자의 세션 사용자 ID는 음수 — UserPrincipal.userId) */
    public static boolean isManager(UserPrincipal user) {
        return (user.getUserId() != null && user.getUserId() < 0) || Long.valueOf(0).equals(user.getCompanyId());
    }
}
