package kr.co.kfs.asseterp.biz.pay.dto;

/** 전표에 묶인 지출결의서 한 건 (AS-IS pay50_expense.selectByJournalId) — [삭제]에서 행을 지울지 전표만 풀지 정하는 데 쓴다 */
public record ExpenseJournalExpenseRes(
        Long expenseId,
        String expenseCode,
        Long settleEmpId
) {
}
