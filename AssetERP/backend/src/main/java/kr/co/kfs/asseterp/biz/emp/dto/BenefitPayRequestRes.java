package kr.co.kfs.asseterp.biz.emp.dto;

/** 지출결의 기준년월·신청구분의 지출결의서 상신 상태 (AS-IS emp17_benefit.selectByYyyymm LIMIT 1). 행이 없으면 응답이 null */
public record BenefitPayRequestRes(Long payRequestApprId, String payRequestApprStatusCode, String payRequestApprStatusName) {
}
