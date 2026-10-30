package kr.co.kfs.asseterp.biz.pay.dto;

/** initExpenseSettle(자금집행 [삭제])가 읽는 값 — 구분·전표·집행결의서 상신 */
public record ExpenseSettleInitRes(Long expenseId, String expenseCode, Long journalId, Long settleApprId) {
}
