package kr.co.kfs.asseterp.biz.ics.dto;

/** 작성 행 하나 (AS-IS Ics31_ComplianceWriteModel — 그리드 행의 complianceWriteModel) */
public record IcsComplianceWriteItem(Long complianceWriteId, Long complianceId, String answerCode, String reason, Boolean fixYn, Boolean confirmYn) {
}
