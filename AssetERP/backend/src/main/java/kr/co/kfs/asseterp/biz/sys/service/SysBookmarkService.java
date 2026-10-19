package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkRes;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysBookmarkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys40_Bookmark.java (selectBySearchText L24, insertMenuId L34, deleteMenuId L48, deleteAll L58, update L67). 로그인 사용자·회사의 북마크만 다룬다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysBookmarkService {

    private final SysBookmarkMapper mapper;

    /** AS-IS Sys40_Lookup_Bookmark.retrieve() L111-124: 로그인 사용자·회사, searchText "%" */
    public List<BookmarkRes> search(UserPrincipal user) {
        return mapper.selectBySearchText(user.getUserId(), user.getCompanyId(), "%");
    }

    /** AS-IS update(UpdateDataModel): 그룹명·순서만 고친다 → 고친 건수 */
    @Transactional
    public int update(UserPrincipal user, List<BookmarkSaveReq> rows) {
        int n = 0;
        for (BookmarkSaveReq req : rows) {
            n += mapper.update(user.getUserId(), user.getCompanyId(), req);
        }
        return n;
    }

    /** AS-IS insertMenuId L34-46: 이미 북마크한 메뉴가 아니면 넣는다 */
    @Transactional
    public void insertMenuId(UserPrincipal user, Long menuId) {
        if (mapper.selectByMenuId(user.getUserId(), user.getCompanyId(), menuId).isEmpty()) {
            mapper.insertMenuId(user.getUserId(), user.getCompanyId(), menuId);
        }
    }

    /** AS-IS deleteMenuId L48-56 */
    @Transactional
    public void deleteMenuId(UserPrincipal user, Long menuId) {
        mapper.deleteMenuId(user.getUserId(), user.getCompanyId(), menuId);
    }

    /** AS-IS deleteAll L58-65 → 지운 건수 */
    @Transactional
    public int deleteAll(UserPrincipal user) {
        return mapper.deleteAll(user.getUserId(), user.getCompanyId());
    }
}
