package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportEmp;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsComplianceReportMapper {

    /** AS-IS emp03_trans.selectInOffice — 기준일 재직 사원. exceptBizCode가 있으면 그 예외업무에서 '표시안함'인 사원을 뺀다 */
    List<IcsComplianceReportEmp> selectInOffice(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("exceptBizCode") String exceptBizCode);

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
    IcsComplianceReportApprRes selectAppr(@Param("companyId") Long companyId, @Param("yyyymm") String yyyymm, @Param("cycleType") String cycleType);
}
