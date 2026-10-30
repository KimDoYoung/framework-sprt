package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS ast.Ast20_TrTax.selectGenLedgerTax — 총계정원장의 예수금/부가세 잔액 */
public record TrTaxLedgerRes(Long incomeTax, Long localTax, Long etcTax, Long prePayVat, Long preRcvVat) {
}
