package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 종목별 매수·매도 거래 한 행(Ast06_TabPage_FinanceBookOpr) — ast06_tr.selectByAstClassTreeId */
public record FinanceOprTrRes(Long trId, LocalDate date, Double qty, Double price, Long trAmt, Long amt, String note, Long feeSum,
                              Long purBookAmt, Double purPlRate, Long pl) {
}
