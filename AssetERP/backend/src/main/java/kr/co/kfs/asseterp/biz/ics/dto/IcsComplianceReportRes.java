package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * 내부통제 준수보고서 한 줄 (AS-IS Sys99_Print.insertComplianceState가 sys99_print에 쌓던 행 → RD 리포트 Ics31_Tab_ComplianceReport).
 * seq = 재직 사원 순번, complianceResult = 준수결과(f_get_compliance_result), reason = 미준수 사유(준수면 null)
 */
public record IcsComplianceReportRes(Long seq, Long personId, String personName, String orgName, String complianceType, String complianceTypeName,
                                     String complianceResult, String reason) {
}
