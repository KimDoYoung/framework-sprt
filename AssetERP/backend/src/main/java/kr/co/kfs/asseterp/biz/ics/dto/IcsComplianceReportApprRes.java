package kr.co.kfs.asseterp.biz.ics.dto;

/** 그 달 준수보고의 상신 연결 (AS-IS ics32_relate_appr.selectByCompanyId) — 상신 전이면 statusCode 없음 */
public record IcsComplianceReportApprRes(Long relateApprId, Long apprId, String statusCode, String statusName) {
}
