package kr.co.kfs.asseterp.biz.crd.dto;

/** 법인카드 업로드 구분코드 맵핑 한 행 — 화면 그리드 열(업로드 구분코드 · 위치(세로줄) · 비고). bankExcelCode는 CreditCardExcelCode 코드 */
public record CrdExcelCodeRes(Long excelCodeId, Long companyId, String bankCode, String bankName,
                              String bankExcelCode, String bankExcelName, Long seq, String text) {
}
