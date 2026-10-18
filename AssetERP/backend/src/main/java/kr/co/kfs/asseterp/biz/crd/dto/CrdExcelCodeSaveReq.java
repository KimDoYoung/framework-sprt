package kr.co.kfs.asseterp.biz.crd.dto;

/** 업로드 구분코드 맵핑 저장 한 행 — excelCodeId가 0 이하이거나 DB에 없으면 등록 */
public record CrdExcelCodeSaveReq(Long excelCodeId, String bankCode, String bankExcelCode, Long seq, String text) {
}
