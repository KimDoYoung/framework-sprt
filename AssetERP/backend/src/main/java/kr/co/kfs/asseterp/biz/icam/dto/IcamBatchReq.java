package kr.co.kfs.asseterp.biz.icam.dto;

/** ICAM Get·타사무 Get 요청. actionCode = icamFund | extrFund, companyId = 회사 ID 또는 "ALL"(전체 고객사) */
public record IcamBatchReq(String actionCode, String companyId) {
}
