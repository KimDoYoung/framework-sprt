package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics30_Tab_Compliance 왼쪽 그리드 (AS-IS ics30_compliance.groupByStartDate): 기준 적용일마다 한 행 */
public record IcsComplianceDateRes(Long complianceId, LocalDate startDate, String dateFixYn) {
}
