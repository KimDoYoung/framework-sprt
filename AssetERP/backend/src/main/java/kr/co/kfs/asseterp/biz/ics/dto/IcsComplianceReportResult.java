package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 사원 한 명의 준수항목별 결과 (AS-IS ics30_compliance.selectComplianceResultByPersonId). startDate = 준수항목 적용시작일(출력 자료 date02) */
public record IcsComplianceReportResult(String complianceType, String complianceTypeName, String complianceResult, LocalDate startDate) {
}
