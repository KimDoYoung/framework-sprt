package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 금융상품 운용내역(보유·평가) 한 행(Ast09_Tab_FinanceBookOpr 가운데 그리드) — ast09_book.selectFinanceByHoldDate */
public record FinanceOprRes(Long bookId, LocalDate holdDate, Long astClassTreeId, Long keepAccountId, String keepAccountName,
                            String astClassName, String astClassTreeName, LocalDate firstPurDate, Double holdQty, Long purAmt,
                            Long bookAmt, Double purPrice, Double evalPrice, Long evalAmt, Long evalPl, Long purEvalPl,
                            Double tyPlRate, Double purPlRate, String stopLossNotice, LocalDate sellPossibleDate, String holdPeriod) {
}
