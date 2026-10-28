package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay27_Lookup_TaxDeductTable — 세액공제 + 세액공제 한도 */
public record PayRetireTaxDeductRes(List<PayTaxDeductRes> deducts, List<PayTaxDeductLimitRes> limits) {
}
