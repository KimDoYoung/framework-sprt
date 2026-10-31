package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPersonAuthRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTypoSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr92_appr_modi.xml · apr50_bookmark.xml · apr13_person_auth.xml · apr90_disposal_list.xml (V09 오타수정·중요표시·공람설정·폐기신청) */
@Mapper
public interface AprApprExtraMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    // ── 오타수정 (apr92) ──

    /** AS-IS apr92_appr_modi.selectByPersonId */
    AprTypoRes selectTypo(@Param("apprId") Long apprId, @Param("personId") Long personId);

    /** AS-IS apr92_appr_modi.insert — 고치기 전 문서를 그대로 복사해 둔다 */
    int insertTypoSnapshot(@Param("apprModiId") Long apprModiId, @Param("apprId") Long apprId, @Param("regEmpId") Long regEmpId, @Param("reason") String reason);

    /** AS-IS apr92_appr_modi.updateReason */
    int updateTypoReason(@Param("apprModiId") Long apprModiId, @Param("reason") String reason);

    /** AS-IS Apr01_Appr.modelUpdate의 UpdateDataModel(apr01_appr) — 이 창이 바꾸는 열만 */
    int updateApprTypo(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("r") AprTypoSaveReq req, @Param("content") String content);

    // ── 중요표시 (apr50) ──

    /** AS-IS apr50_bookmark.selectByApprId */
    List<AprBookmarkRes> selectBookmarks(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** AS-IS apr50_bookmark.insertCheck */
    int countBookmarkAllRow(@Param("apprId") Long apprId);

    /** AS-IS apr50_bookmark.insert */
    int insertBookmarkAllRow(@Param("bookmarkId") Long bookmarkId, @Param("companyId") Long companyId, @Param("apprId") Long apprId, @Param("publicYn") String publicYn);

    /** AS-IS apr50_bookmark.updatePublicYn */
    int updateBookmarkAllRow(@Param("apprId") Long apprId, @Param("publicYn") String publicYn);

    /** AS-IS apr50_bookmark.deleteByApprId */
    int deleteBookmarksByApprId(@Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** AS-IS Apr50_Bookmark.update(UpdateDataModel) — 사원 줄 추가 */
    int insertBookmarkPerson(@Param("bookmarkId") Long bookmarkId, @Param("companyId") Long companyId, @Param("apprId") Long apprId, @Param("personId") Long personId);

    /** AS-IS Apr50_Bookmark.delete(UpdateDataModel) */
    int deleteBookmarks(@Param("companyId") Long companyId, @Param("apprId") Long apprId, @Param("ids") List<Long> ids);

    // ── 공람설정 (apr13) ──

    /** AS-IS apr13_person_auth.selectByApprId */
    List<AprPersonAuthRes> selectPersonAuths(@Param("apprId") Long apprId);

    /** AS-IS Apr13_PersonAuth.update(UpdateDataModel) */
    int insertPersonAuth(@Param("personAuthId") Long personAuthId, @Param("apprId") Long apprId, @Param("personId") Long personId);

    /** AS-IS Apr13_PersonAuth.delete(UpdateDataModel) */
    int deletePersonAuths(@Param("apprId") Long apprId, @Param("ids") List<Long> ids);

    // ── 문서폐기 신청 (apr90) ──

    /** AS-IS apr90_disposal_list.checkDisposal */
    int countDisposal(@Param("apprId") Long apprId);

    /** AS-IS pay50_expense.selectByExpenseApprId */
    int countSettledExpense(@Param("apprId") Long apprId);

    /** AS-IS com01_relate_appr.checkUseRelateApprId */
    int countRelateUse(@Param("apprId") Long apprId);

    /** AS-IS Apr90_DisposalList.modelUpdate의 UpdateDataModel(apr90_disposal_list) */
    int insertDisposal(@Param("disposalListId") Long disposalListId, @Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId,
                       @Param("reason") String reason, @Param("confirmEmpId") Long confirmEmpId, @Param("apprId") Long apprId);
}
