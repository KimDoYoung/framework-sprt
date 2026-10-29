package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EvalAdminRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalCandidateRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalExecuteRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalRelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalSettingRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetRow;
import kr.co.kfs.asseterp.biz.emp.dto.HighInfoRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp43_eval_target.xml + emp44_eval_write.xml + emp45_eval_relate_appr.xml + emp00_trans_info.xml(selectByEvalText·getHighInfo) — 인사평가 대상자 */
@Mapper
public interface EmpEvalTargetMapper {
    /** AS-IS emp43_eval_target.selectByTermCode */
    List<EvalTargetRes> selectByTermCode(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                                         @Param("stdTermCode") String stdTermCode, @Param("orgId") Long orgId);

    /** AS-IS emp43_eval_target.selectById */
    EvalTargetRes selectById(@Param("evalTargetId") Long evalTargetId, @Param("companyId") Long companyId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insertEvalTarget(@Param("companyId") Long companyId, @Param("row") EvalTargetRow row);

    int updateEvalTarget(@Param("companyId") Long companyId, @Param("row") EvalTargetRow row);

    int deleteEvalTarget(@Param("companyId") Long companyId, @Param("evalTargetId") Long evalTargetId);

    /** AS-IS emp43_eval_target.updateEval */
    int updateEval(@Param("companyId") Long companyId, @Param("evalTargetId") Long evalTargetId,
                   @Param("firstPersonId") Long firstPersonId, @Param("firstEvalWeight") Long firstEvalWeight,
                   @Param("secondPersonId") Long secondPersonId, @Param("secondEvalWeight") Long secondEvalWeight);

    /** AS-IS emp44_eval_write.deleteByPersonId */
    int deleteWriteByPersonId(@Param("companyId") Long companyId, @Param("stdYear") String stdYear,
                              @Param("stdTermCode") String stdTermCode, @Param("targetPersonId") Long targetPersonId,
                              @Param("personId") Long personId);

    /** AS-IS emp44_eval_write.selectByEvaluatorId (건수) */
    int countWriteByEvaluatorId(@Param("companyId") Long companyId, @Param("evalTargetId") Long evalTargetId, @Param("personId") Long personId);

    /** AS-IS emp45_eval_relate_appr.selectByTermCode (최종 결재 상태 코드) */
    List<String> selectFinalApprStatusCodes(@Param("companyId") Long companyId, @Param("stdYear") String stdYear, @Param("stdTermCode") String stdTermCode);

    /** AS-IS emp00_trans_info.selectByEvalText */
    List<EvalCandidateRes> selectByEvalText(@Param("companyId") Long companyId, @Param("searchText") String searchText, @Param("transDate") String transDate);

    /** AS-IS emp00_trans_info.getHighInfo */
    List<HighInfoRes> getHighInfo(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                  @Param("orgCodeId") Long orgCodeId, @Param("transDate") String transDate);

    /** AS-IS sys01_company.selectById 중 인사평가 평가기간·시작월 */
    EvalSettingRes selectEvalSetting(@Param("companyId") Long companyId);

    /** AS-IS emp43_eval_target.selectByText — 로그인 사원이 평가자인 대상자 */
    List<EvalExecuteRes> selectByText(@Param("companyId") Long companyId, @Param("stdYear") String stdYear, @Param("stdTermCode") String stdTermCode,
                                      @Param("searchText") String searchText, @Param("personId") Long personId);

    /** AS-IS emp43_eval_target.getWrite 중 평가상태 */
    String selectWriteStatus(@Param("evalTargetId") Long evalTargetId, @Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp43_eval_target.updateReason */
    int updateReason(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("evalTargetId") Long evalTargetId,
                     @Param("reason") String reason, @Param("orderEvalName") String orderEvalName);

    /** AS-IS emp43_eval_target.updateEndYn */
    int updateEndYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("evalTargetId") Long evalTargetId,
                    @Param("endYn") String endYn, @Param("orderEvalName") String orderEvalName);

    /** AS-IS emp45_eval_relate_appr.selectByTermCode 중 1차보고 상신문서 상태 코드 */
    List<String> selectApprStatusCodes(@Param("companyId") Long companyId, @Param("stdYear") String stdYear, @Param("stdTermCode") String stdTermCode);

    /** AS-IS emp43_eval_target.selectByTextAdmin — 전체 대상자(인사부·대표이사) */
    List<EvalAdminRes> selectByTextAdmin(@Param("companyId") Long companyId, @Param("stdYear") String stdYear, @Param("stdTermCode") String stdTermCode,
                                         @Param("searchText") String searchText);

    /** AS-IS emp43_eval_target.modelUpdate — 상점·벌점·평정사유가감 */
    int updateScore(@Param("companyId") Long companyId, @Param("evalTargetId") Long evalTargetId, @Param("plusScore") Long plusScore,
                    @Param("minusScore") Long minusScore, @Param("reasonAdjustScore") Long reasonAdjustScore);

    /** AS-IS emp43_eval_target.modelUpdate — 대표이사 가점·감점 */
    int updateCeoScore(@Param("companyId") Long companyId, @Param("evalTargetId") Long evalTargetId, @Param("ceoEvalBonus") Long ceoEvalBonus,
                       @Param("ceoEvalPenalty") Long ceoEvalPenalty);

    /** AS-IS emp45_eval_relate_appr.selectByTermCode — 상신 상태 전체 */
    List<EvalRelateApprRes> selectRelateAppr(@Param("companyId") Long companyId, @Param("stdYear") String stdYear, @Param("stdTermCode") String stdTermCode);
}
