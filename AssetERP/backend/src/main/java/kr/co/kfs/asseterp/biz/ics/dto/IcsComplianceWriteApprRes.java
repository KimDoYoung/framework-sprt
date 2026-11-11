package kr.co.kfs.asseterp.biz.ics.dto;

/** #1310 작성자 상신 상태 (AS-IS ics32_relate_appr.selectApprCheck, A53) — statusCode null이면 미상신 */
public record IcsComplianceWriteApprRes(Long apprId, String statusCode, String statusName) {
}
