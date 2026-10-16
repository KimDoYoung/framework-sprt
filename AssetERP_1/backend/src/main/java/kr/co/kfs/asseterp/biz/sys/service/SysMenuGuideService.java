package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuNameRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMenuGuideMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Sys06_Tab_MenuGuide → server/sys/Sys06_Menu (selectByMenuId L555 / update L695), Sys00_Common.selectMenuName L46 — 관리자 메뉴 화면이라 sys admin만. 메뉴 테이블에 회사 컬럼이 없다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMenuGuideService {

    private final SysMenuGuideMapper mapper;

    public List<MenuNameRes> searchMenuNames(UserPrincipal user) {
        requireSysAdmin(user);
        return mapper.selectMenuNames();
    }

    /** AS-IS retrieve() L126-155: menuId null = 전체, 검색어는 클라이언트가 "%"+값+"%"(빈 값이면 "%")로 보냈다 → 서버가 만든다 */
    public List<MenuGuideRes> search(UserPrincipal user, Long menuId, String searchText) {
        requireSysAdmin(user);
        String like = searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%";
        return mapper.selectByMenuId(menuId, like);
    }

    /** AS-IS update(UpdateDataModel): 화면이 바꾸는 화면안내(sys06_note)만. 저장한 행 수 */
    @Transactional
    public int update(UserPrincipal user, List<MenuGuideSaveReq> rows) {
        requireSysAdmin(user);
        for (MenuGuideSaveReq req : rows) {
            if (req.menuId() == null || mapper.updateNote(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.size();
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
