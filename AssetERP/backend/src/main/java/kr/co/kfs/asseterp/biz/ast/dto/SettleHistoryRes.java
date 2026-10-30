package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** ast07_settle.selectByHistory·selectByHistoryPaing 한 행 (실수령/지급 History 그리드, U11) */
public record SettleHistoryRes(Long settleId, LocalDate settleDate, String trName, String orgTrName, String corpName, String note, Long settleAmt,
                               Long journalId, Long expenseId, Long trId, String trCode, Long personId) {
}
