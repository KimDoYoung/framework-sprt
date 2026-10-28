package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay13_TabPage_RetireTax.retrieve — 금액 필드(tax가 null이면 비움) + 그리드 4개 */
public record PayRetireTaxDetailRes(PayRetireTaxRes tax, List<PayRetireTaxItemRes> incomes,
                                    List<PayRetireTaxItemRes> deducts, List<PayRetireTaxItemRes> credits,
                                    List<PayRetireTaxOfficeRes> offices) {
}
