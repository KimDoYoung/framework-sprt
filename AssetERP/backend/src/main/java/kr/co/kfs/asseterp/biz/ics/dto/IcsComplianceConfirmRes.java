package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * Ics31_Tab_ComplianceConfirm 그리드 한 행 (AS-IS ics30_compliance.selectByCompanyIdPaging → Ics30_ComplianceModel).
 * reason은 답변 이름 + (사유) — 예: "아니오(사유)"
 */
public record IcsComplianceConfirmRes(Long complianceWriteId, String complianceTypeName, String subNum, String content, String reason,
                                      String orgName, String personName, Boolean fixYn, Boolean confirmYn) {
}
