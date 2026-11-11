package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteItem;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsComplianceWriteMapper {

    /** AS-IS Sys01_Company.selectById 중 sys01_ics_comply_cycle_type — M(월)/Q(분기), 없으면 null */
    String selectCycleType(@Param("companyId") Long companyId);

    /** AS-IS ics30_compliance.selectByPersonId — 기준일에 유효한 확정 준수리스트 + 내 작성 내역. checkBox면 답변 없는 항목만 */
    List<IcsComplianceWriteRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate,
                                                 @Param("searchText") String searchText, @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType);

    /** AS-IS ics31_compliance_write.selectById — 내 작성 행만 */
    IcsComplianceWriteItem selectById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceWriteId") Long complianceWriteId);

    /** AS-IS ics31_compliance_write.selectByPersonId — 한 항목의 그 달 작성 행 */
    IcsComplianceWriteItem selectByCompliance(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceId") Long complianceId,
                                              @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType);

    /** AS-IS ics31_compliance_write.selectWrite — 삭제 전 확인용(기준일 이전 유효 리스트의 내 작성 행) */
    List<IcsComplianceWriteItem> selectWrite(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate,
                                             @Param("cycleType") String cycleType);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Ics31_ComplianceWrite.updateAnswerCode / modelUpdate(INSERT) — 작성 행 추가 */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceWriteId") Long complianceWriteId,
               @Param("complianceId") Long complianceId, @Param("yyyymm") String yyyymm, @Param("answerCode") String answerCode,
               @Param("cycleType") String cycleType);

    /** AS-IS ics31_compliance_write.updateAnswerCode — 내 작성 행만 */
    int updateAnswerCode(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceWriteId") Long complianceWriteId,
                         @Param("answerCode") String answerCode);

    /** AS-IS Ics31_Edit_Reason.update → modelUpdate(UPDATE) — 사유만 바뀐다 */
    int updateReason(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceWriteId") Long complianceWriteId,
                     @Param("reason") String reason);

    /** AS-IS ics31_compliance_write.updateFixYn — 내 작성 행만 */
    int updateFixYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceWriteId") Long complianceWriteId,
                    @Param("fixYn") String fixYn, @Param("confirmerId") Long confirmerId);

    /** AS-IS ics30_compliance.selectConfirmer — 기본 확인자 (이전 확인자 → 소속 부서장 → 준법감시인) */
    IcsComplianceConfirmerRes selectConfirmer(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS ics32_relate_appr.selectApprStatus(apprType 2 부서장 준수확인서) — 그 확인자가 이 분기(월)에 상신해 결재 중·완료인 건수 */
    int countApprStatus(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyymm") String yyyymm,
                        @Param("cycleType") String cycleType);

    /** AS-IS UpdateDataModel.deleteModel(ics31_compliance_write) — 내 작성 행만 */
    /** 회사 설정 임직원준수점검 상신자 (1 = 작성자, 원본 2026-11-04) */
    String selectApprRegEmpType(@Param("companyId") Long companyId);

    /** AS-IS ics32_relate_appr.selectApprCheck (A53) — 없으면 null */
    kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteApprRes selectApprCheck(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                                          @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType);

    /** AS-IS ics32_relate_appr.selectApprList (A53) — 문서 ID 최근 순 */
    List<Long> selectApprIds(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType);

    /** AS-IS ics32_relate_appr.selectLastAppr — 최근 상신 문서의 문서분류, 없으면 null */
    Long selectLastClassTreeId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS ics32_relate_appr.insertApprId */
    int insertApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("yyyymm") String yyyymm,
                     @Param("cycleType") String cycleType, @Param("apprId") Long apprId);

    int countA53Appr(@Param("companyId") Long companyId, @Param("apprId") Long apprId);

    int deleteById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("complianceWriteId") Long complianceWriteId);
}
