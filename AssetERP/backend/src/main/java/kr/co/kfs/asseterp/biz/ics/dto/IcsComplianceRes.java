package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics30_Tab_Compliance 준수항목 그리드 (AS-IS ics30_compliance.selectByStartDate) */
public record IcsComplianceRes(Long complianceId, Long companyId, LocalDate startDate, String complianceType, String complianceTypeName,
                               String subNum, String content, String naUseYn, String useYn, LocalDate useCloseDate, String note, String dateFixYn) {
}
