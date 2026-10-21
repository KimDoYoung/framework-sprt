package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/**
 * Ics31_Tab_ComplianceWrite 그리드 한 행 (AS-IS ics30_compliance.selectByPersonId → Ics30_ComplianceModel).
 * 작성 행이 없으면 complianceWriteId·answerCode·reason이 비어 있다(LEFT JOIN)
 */
public record IcsComplianceWriteRes(Long complianceId, Long companyId, LocalDate startDate, String complianceType, String complianceTypeName,
                                    String subNum, String content, String naUseYn,
                                    Long complianceWriteId, String answerCode, String reason, Boolean fixYn, Boolean confirmYn,
                                    String confirmerName, String personName, String orgName) {
}
