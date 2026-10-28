package kr.co.kfs.asseterp.biz.pay.dto;

/** 퇴직정산 소득세(pay13_retire_tax) — 당해년도/전년도(py) 금액 */
public record PayRetireTaxRes(Long retireTaxId, Long monthId,
                              Long incomeDeduct, Long incomeAmt, Long taxBase, Long calcTax, Long decideTax,
                              Long preOfficePayTax, Long curOfficePayTax, Long settleTax,
                              Long pyIncomeDeduct, Long pyIncomeAmt, Long pyTaxBase, Long pyCalcTax, Long pyDecideTax,
                              Long pyPreOfficePayTax, Long pyCurOfficePayTax, Long pySettleTax) {
}
