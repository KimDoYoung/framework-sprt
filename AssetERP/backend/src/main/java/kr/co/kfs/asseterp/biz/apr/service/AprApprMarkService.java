package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPersonAuthRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprExtraMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** [중요표시 설정](문서창의 북마크 별)·[공람설정] (AS-IS client/vi/apr/Apr50_Lookup_PersonList · Apr13_Lookup_PersonAuth, V09). 문서를 볼 수 있는 사원만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprMarkService {

    private final AprApprExtraMapper mapper;
    private final AprApprDetailService detailService;

    /** AS-IS apr.Apr50_Bookmark.selectByApprId — personId가 없는 줄이 "전체 중요표시" 스위치 줄이다 */
    public List<AprBookmarkRes> getBookmarks(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectBookmarks(apprId, user.getCompanyId());
    }

    /** AS-IS apr.Apr50_Bookmark.insert L69-84: 스위치 줄이 있으면 값만 바꾸고 없으면 만든다 */
    @Transactional
    public void setBookmarkPublic(UserPrincipal user, Long apprId, boolean publicYn) {
        detailService.getDetail(user, apprId);
        String value = String.valueOf(publicYn);
        if (mapper.countBookmarkAllRow(apprId) > 0) {
            mapper.updateBookmarkAllRow(apprId, value);
        } else {
            mapper.insertBookmarkAllRow(mapper.selectNextId(), user.getCompanyId(), apprId, value);
        }
    }

    /** AS-IS apr.Apr50_Bookmark.deleteByApprId — [초기화] */
    @Transactional
    public void clearBookmarks(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        mapper.deleteBookmarksByApprId(user.getCompanyId(), apprId);
    }

    /** AS-IS apr.Apr50_Bookmark.update(UpdateDataModel) — [저장]: 새로 넣은 사원 줄 */
    @Transactional
    public void addBookmarkPersons(UserPrincipal user, Long apprId, List<Long> personIds) {
        detailService.getDetail(user, apprId);
        if (personIds == null) {
            return;
        }
        for (Long personId : personIds) {
            mapper.insertBookmarkPerson(mapper.selectNextId(), user.getCompanyId(), apprId, personId);
        }
    }

    /** AS-IS apr.Apr50_Bookmark.delete(UpdateDataModel) — [삭제]: 체크한 줄 */
    @Transactional
    public void deleteBookmarks(UserPrincipal user, Long apprId, List<Long> ids) {
        detailService.getDetail(user, apprId);
        if (ids == null || ids.isEmpty()) {
            return;
        }
        mapper.deleteBookmarks(user.getCompanyId(), apprId, ids);
    }

    /** AS-IS apr.Apr13_PersonAuth.selectByApprId */
    public List<AprPersonAuthRes> getPersonAuths(UserPrincipal user, Long apprId) {
        detailService.getDetail(user, apprId);
        return mapper.selectPersonAuths(apprId);
    }

    /** AS-IS apr.Apr13_PersonAuth.update → delete (Apr13_Lookup_PersonAuth.update L159-170) */
    @Transactional
    public void savePersonAuths(UserPrincipal user, Long apprId, List<Long> addPersonIds, List<Long> deleteIds) {
        detailService.getDetail(user, apprId);
        if (addPersonIds != null) {
            for (Long personId : addPersonIds) {
                mapper.insertPersonAuth(mapper.selectNextId(), apprId, personId);
            }
        }
        if (deleteIds != null && !deleteIds.isEmpty()) {
            mapper.deletePersonAuths(apprId, deleteIds);
        }
    }
}
