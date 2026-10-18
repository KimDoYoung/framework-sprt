package kr.co.kfs.asseterp.biz.crd.dto;

/** 법인카드 업로드 카드사 저장 한 행 — excelCompanyId가 0 이하이거나 DB에 없으면 등록 */
public record CrdExcelCompanySaveReq(Long excelCompanyId, String bankCode, String note) {
}
