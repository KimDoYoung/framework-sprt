package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여대장 상신 상태(Pay10_Tab_List) — statusCode가 null이면 결재문서 없음(미상신), 40은 반려 */
public record PayRelateApprRes(Long relateApprId, Long apprId, String statusCode, String statusName) {
}
