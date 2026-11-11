package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportEmp;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsComplianceReportMapper {

    /**
     * AS-IS emp03_trans.selectInOffice — 기준일 재직 사원. exceptBizCode가 있으면 그 예외업무에서 '표시안함'인 사원을 뺀다.
     * confirmerId가 있으면 그 확인자에게 배정된 그 달·주기 작성이 있는 사원만(원본 2026-10-23, #1311 RD 첨부 PDF)
     */
    List<IcsComplianceReportEmp> selectInOffice(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("exceptBizCode") String exceptBizCode,
                                                @Param("cycleType") String cycleType, @Param("confirmerId") Long confirmerId);

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertComplianceState → sys99_print.insert (보고 한 줄) */
    int insertPrintState(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                         @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                         @Param("stdDate") LocalDate stdDate, @Param("startDate") LocalDate startDate, @Param("row") IcsComplianceReportRes row);

    /** AS-IS ics31_compliance_write.checkWriteByPersonId — 그 달 제출한 작성 행 수 */
    int countFixedWrite(@Param("personId") Long personId, @Param("stdDate") LocalDate stdDate, @Param("cycleType") String cycleType);

    /** AS-IS emp03_trans.getRetireDate — f_get_empTrans(…, 'retire_date'), 퇴사일이 없으면 null */
    LocalDate selectRetireDate(@Param("personId") Long personId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS ics30_compliance.selectComplianceResultByPersonId */
    List<IcsComplianceReportResult> selectResults(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate,
                                                  @Param("cycleType") String cycleType, @Param("kindCode") String kindCode);

    /** AS-IS ics31_compliance_write.selectNonComplianceReason */
    String selectNonComplianceReason(@Param("personId") Long personId, @Param("stdDate") LocalDate stdDate, @Param("cycleType") String cycleType,
                                     @Param("complianceType") String complianceType);

    /** AS-IS ics32_relate_appr.selectByCompanyId — 없으면 null */
    IcsComplianceReportApprRes selectAppr(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType,
                                          @Param("apprType") String apprType, @Param("personId") Long personId);

    /** AS-IS ics32_relate_appr.selectByCompanyId — 그 달 연결 행의 ID (없으면 null) */
    Long selectRelateApprId(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType,
                            @Param("apprType") String apprType, @Param("personId") Long personId);

    long selectNextId();

    /** AS-IS ics32_relate_appr.insert */
    int insertRelateAppr(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId,
                         @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType,
                         @Param("personId") Long personId, @Param("apprType") String apprType);

    /** AS-IS ics32_relate_appr.updateApprId — 회사 조건 추가. 상신 문서가 이 회사 것인지는 countAppr로 먼저 본다 */
    int updateRelateApprId(@Param("companyId") Long companyId, @Param("relateApprId") Long relateApprId, @Param("apprId") Long apprId);

    int countAppr(@Param("companyId") Long companyId, @Param("apprId") Long apprId);
}
