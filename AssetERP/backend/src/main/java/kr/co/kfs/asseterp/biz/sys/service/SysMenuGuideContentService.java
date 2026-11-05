package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideContentRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideContentSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysMenuGuideContentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/sys/Sys55_MenuGuideCompany.java (Sys55_Lookup_Content 팝업 — 화면안내 보기·작성) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysMenuGuideContentService {

    private final SysMenuGuideContentMapper mapper;

    /** AS-IS getMenuDetailModel L35-43: 로그인 회사의 그 메뉴 화면안내. 없으면 null */
    public MenuGuideContentRes getByMenuNo(UserPrincipal user, String menuNo) {
        return mapper.selectByMenuNo(user.getCompanyId(), menuNo);
    }

    /** AS-IS upsertContent L45-74: menuGuideCompanyId가 없으면 새 ID로 넣고(INSERT), 있으면 내용을 고친다(updateContent). 회사 = 로그인 회사. 저장한 행 */
    @Transactional
    public MenuGuideContentRes save(UserPrincipal user, MenuGuideContentSaveReq req) {
        Long id = req.menuGuideCompanyId();
        if (id == null) {
            id = mapper.selectNextId();
            mapper.insertContent(id, user.getCompanyId(), req.menuId(), req.content());
        } else {
            mapper.updateContent(id, user.getCompanyId(), req.menuId(), req.content());
        }
        return new MenuGuideContentRes(id, user.getCompanyId(), req.menuId(), req.content(), null, null);
    }
}
