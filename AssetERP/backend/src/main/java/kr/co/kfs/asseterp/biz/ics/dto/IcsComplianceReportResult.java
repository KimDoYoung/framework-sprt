package kr.co.kfs.asseterp.biz.ics.dto;

/** 사원 한 명의 준수항목별 결과 (AS-IS ics30_compliance.selectComplianceResultByPersonId) */
public record IcsComplianceReportResult(String complianceType, String complianceTypeName, String complianceResult) {
}
