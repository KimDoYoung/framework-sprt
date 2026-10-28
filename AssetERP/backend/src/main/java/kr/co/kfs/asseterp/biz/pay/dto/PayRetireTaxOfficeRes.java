package kr.co.kfs.asseterp.biz.pay.dto;

/** 9. 기납부세액 그리드 — 1:종(전)근무지 2:주(현)근무지 */
public record PayRetireTaxOfficeRes(Long retireTaxId, String titleName, Long officePayTax, Long pyOfficePayTax) {
}
