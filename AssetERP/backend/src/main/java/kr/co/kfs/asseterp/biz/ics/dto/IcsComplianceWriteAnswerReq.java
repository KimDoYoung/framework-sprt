package kr.co.kfs.asseterp.biz.ics.dto;

/** 예·아니오·해당없음 체크 (AS-IS ics.Ics31_ComplianceWrite.updateAnswerCode) — yyyymm은 'yyyy.MM' */
public record IcsComplianceWriteAnswerReq(Long complianceId, String answerCode, String yyyymm, String cycleType) {
}
