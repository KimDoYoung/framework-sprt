package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkListRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprBookmarkListMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/apr/Apr50_Bookmark.selectByPersonIdPaging(+Total) L33 — 중요표시 문서 창(Apr50_Lookup_ApprList) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprBookmarkListService {

    private final AprBookmarkListMapper mapper;

    /** 내가 중요표시했거나 전체공유(publicYn 'true')된 문서. searchText는 상신제목/등록자/부서/문서분류에 든 글자 */
    public PageRes<AprBookmarkListRes> search(UserPrincipal user, String searchText, long offset, long limit) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return new PageRes<>(mapper.selectByPersonIdPagingTotal(user.getCompanyId(), user.getUserId(), "true", like),
                mapper.selectByPersonIdPaging(user.getCompanyId(), user.getUserId(), "true", like, limit, offset));
    }
}
