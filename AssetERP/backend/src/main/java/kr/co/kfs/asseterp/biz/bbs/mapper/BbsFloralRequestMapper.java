package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.FloralMessageRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestRes;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralRequestStatusReq;
import kr.co.kfs.asseterp.biz.bbs.dto.FloralShareRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface BbsFloralRequestMapper {

    /** AS-IS bbs20_floral_request.selectByTextAdmin — confirmYn이면 발송완료(92)·반려(91) 제외 */
    List<FloralRequestRes> selectByTextAdmin(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                            @Param("closeDate") LocalDate closeDate, @Param("searchText") String searchText,
                                            @Param("confirmYn") boolean confirmYn);

    /** AS-IS bbs20_floral_request.selectById — 로그인 회사의 행만(보안 보강) */
    FloralRequestRes selectById(@Param("companyId") Long companyId, @Param("floralRequestId") Long floralRequestId);

    /** AS-IS Bbs20_FloralRequest.update → UpdateDataModel UPDATE — 로그인 회사의 행만(보안 보강) */
    int updateStatus(@Param("companyId") Long companyId, @Param("req") FloralRequestStatusReq req);

    /** AS-IS Bbs20_FloralRequest.sendMessage → emp01_person.selectById의 휴대폰번호 */
    String selectMobileTelNo(@Param("personId") Long personId);

    /** AS-IS bbs22_floral_message.insertCode */
    int insertMessageCodes(@Param("companyId") Long companyId, @Param("kindCode") String kindCode);

    /** AS-IS bbs22_floral_message.deleteCode */
    int deleteMessageCodes(@Param("companyId") Long companyId, @Param("kindCode") String kindCode);

    /** AS-IS bbs22_floral_message.selectByCompanyId */
    List<FloralMessageRes> selectMessages(@Param("companyId") Long companyId);

    /** AS-IS Bbs22_FloralMessage.update → UpdateDataModel UPDATE */
    int updateMessage(@Param("companyId") Long companyId, @Param("floralMessageId") Long floralMessageId, @Param("message") String message);

    /** AS-IS bbs21_floral_request_share.selectByFloralRequestId — 로그인 회사 신청의 공유만 */
    List<FloralShareRes> selectShares(@Param("companyId") Long companyId, @Param("floralRequestId") Long floralRequestId);

    /** AS-IS bbs21_floral_request_share.selectShareInfo */
    String selectShareInfo(@Param("floralRequestId") Long floralRequestId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Bbs21_FloralRequestShare.update → UpdateDataModel INSERT */
    int insertShare(@Param("shareId") long shareId, @Param("floralRequestId") Long floralRequestId,
                    @Param("shareCode") String shareCode, @Param("personId") Long personId, @Param("orgId") Long orgId);

    /** AS-IS Bbs21_FloralRequestShare.delete → UpdateDataModel DELETE — 그 신청·로그인 회사의 행만 */
    int deleteShares(@Param("companyId") Long companyId, @Param("floralRequestId") Long floralRequestId, @Param("ids") List<Long> ids);
}
