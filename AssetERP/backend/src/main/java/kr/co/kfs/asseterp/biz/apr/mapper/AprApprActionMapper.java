package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprLastStepRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepStateRow;

/** 결재 처리 (AS-IS server/apr/Apr04_ApprStep confirmUpdate·cancelUpdate·clearApprStepId, Apr01_Appr.deleteByApprId, V02) */
@Mapper
public interface AprApprActionMapper {

    /** AS-IS apr04_appr_step.confirmCheck — 'Y'면 앞 결재가 끝나 결재할 수 있다 */
    String confirmCheck(@Param("apprId") Long apprId, @Param("stepTypeCode") String stepTypeCode, @Param("seq") String seq);

    /** AS-IS apr04_appr_step.nextTurnCheck — 'Y'면 다음 결재자가 아직 결재 전이라 승인취소할 수 있다 */
    String nextTurnCheck(@Param("apprId") Long apprId, @Param("stepTypeCode") String stepTypeCode, @Param("seq") String seq);

    /** AS-IS apr04_appr_step.cancelCheck — 승인(20)·반려(30)한 단계 수 */
    int countDoneSteps(@Param("apprId") Long apprId);

    /** AS-IS apr04_appr_step.confirmUpdate */
    int confirmUpdateStep(@Param("apprId") Long apprId, @Param("stepEmpId") Long stepEmpId, @Param("stepTypeCode") String stepTypeCode,
                          @Param("seq") String seq, @Param("statusCode") String statusCode, @Param("note") String note,
                          @Param("rejectReason") String rejectReason, @Param("apprEmpId") Long apprEmpId);

    /** AS-IS apr04_appr_step.nextConfirmUpdate */
    int nextConfirmUpdate(@Param("apprId") Long apprId, @Param("seq") String seq, @Param("statusCode") String statusCode, @Param("note") String note,
                          @Param("rejectReason") String rejectReason, @Param("apprEmpId") Long apprEmpId);

    /** AS-IS apr04_appr_step.lastStepList — 이번 단계 뒤의 단계(상신·참조 제외) */
    List<AprLastStepRow> selectLastSteps(@Param("apprId") Long apprId, @Param("seq") String seq);

    /** AS-IS apr04_appr_step.selectByApprId 중 단계·상태만 */
    List<AprStepStateRow> selectStepStates(@Param("apprId") Long apprId);

    /** AS-IS apr01_appr.getStampSeq — 인감대장번호(없으면 null) */
    String selectStampSeq(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId,
                          @Param("regDate") LocalDateTime regDate);

    /** AS-IS apr01_appr.confirmUpdate */
    int confirmUpdateAppr(@Param("apprId") Long apprId, @Param("statusCode") String statusCode, @Param("stampSeq") String stampSeq);

    /** AS-IS apr11_advert_book.getAdvertSeq */
    Long selectAdvertSeq();

    /** AS-IS apr11_advert_book.insertAdvertHistory — 종류·매체·건수·비고는 원본도 값을 보내지 않아 비어 있다 */
    int insertAdvertHistory(@Param("advertSeq") Long advertSeq, @Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** AS-IS apr04_appr_step.clearApprStepId */
    int clearApprStep(@Param("apprStepId") Long apprStepId);

    /** AS-IS apr92_appr_modi.deleteByApprId */
    int deleteApprModi(@Param("apprId") Long apprId);

    /** AS-IS apr04_appr_step.cancelUpdate (apprStatusCode '10', 상신자 본인 단계) */
    int cancelUpdateStep(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.cancelUpdate — 상태를 임시저장(99)으로 */
    int cancelUpdateAppr(@Param("apprId") Long apprId);

    /** AS-IS apr16_stamp_doc.selectByApprId (regCheckYn = true) — 등록·날인이 끝난 신청 수 */
    int countStampDocsDone(@Param("apprId") Long apprId);

    /** AS-IS apr16_stamp_doc.deleteByApprId — 아직 등록·날인 전인 신청만 */
    int deleteStampDocs(@Param("apprId") Long apprId);

    /** AS-IS apr01_appr.insertApprDel — 폐기문서(apr99)로 옮긴다 */
    int insertApprDel(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr */
    int deleteAppr(@Param("apprId") Long apprId);

    /** AS-IS opr01_create.updateApprIdByApprId */
    int clearOprApprId(@Param("apprId") Long apprId);

    /** AS-IS pln02_plan.updateApprIdByApprId */
    int clearPlanApprId(@Param("apprId") Long apprId);

    /** AS-IS apr11_advert_book.deleteByApprId */
    int deleteAdvertByApprId(@Param("apprId") Long apprId);
}
