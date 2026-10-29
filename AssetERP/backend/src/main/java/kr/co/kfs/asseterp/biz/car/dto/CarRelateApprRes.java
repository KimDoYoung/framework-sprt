package kr.co.kfs.asseterp.biz.car.dto;

/** AS-IS Car05_RelateApprModel — 차량 운행일지 월별 결재 상태 (apprId·statusCode '10'기안 '20'진행 '30'… '40'반려 등) */
public record CarRelateApprRes(Long apprId, String statusCode, String statusName) {
}
