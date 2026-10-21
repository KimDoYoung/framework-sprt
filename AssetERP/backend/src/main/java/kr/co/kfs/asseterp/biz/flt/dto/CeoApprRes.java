package kr.co.kfs.asseterp.biz.flt.dto;

/** 책임자보고 상신상태 (AS-IS apr01_appr.selectByLinkCode — A72 임직원매매 책임자보고) */
public record CeoApprRes(Long apprId, String statusCode, String statusName) {
}
