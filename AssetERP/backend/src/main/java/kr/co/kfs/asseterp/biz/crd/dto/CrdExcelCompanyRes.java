package kr.co.kfs.asseterp.biz.crd.dto;

/** 법인카드 업로드 카드사 한 행 — 화면 그리드 열(카드사명 · 맵핑 · 비고). bankCode는 CreditCardCompany 코드 */
public record CrdExcelCompanyRes(Long excelCompanyId, Long companyId, String bankCode, String bankName, String note) {
}
