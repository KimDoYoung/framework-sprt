package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** ast16_non_deduct_tax 한 줄 — 불공제세액 관리(Ast16_Lookup_NonDeductTax, W11) */
public record NonDeductTaxRes(Long nonDeductTaxId, Long purTrId, LocalDate applyDate, Long applyNonDeductTax, String note) {
}
