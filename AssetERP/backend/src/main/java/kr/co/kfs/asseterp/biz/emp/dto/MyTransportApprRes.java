package kr.co.kfs.asseterp.biz.emp.dto;

/** Y07 본인 신청서 상신 상태 (AS-IS emp51_relate_appr.selectByPersonId — apprChk) */
public record MyTransportApprRes(Long relateApprId, String regNo, Long apprId, String statusCode, String statusName) {
}
