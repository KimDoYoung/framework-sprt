package kr.co.kfs.asseterp.biz.pay.dto;

/** Pay13_RetireTax.insertOfficePayTax — 9. 기납부세액 저장(menuNum 9) */
public record PayRetireTaxOfficeSaveReq(Long personId, Long monthId, Long preOfficePayTax, Long pyPreOfficePayTax,
                                        Long curOfficePayTax, Long pyCurOfficePayTax) {
}
