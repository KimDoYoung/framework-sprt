package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** Pay50_Tab_ExpenseRequest 그리드 한 행 (AS-IS pay50_expense.selectByDate) — 승인상태·반려사유는 사유 보기 창이 쓴다 */
public record ExpenseMineRes(Long expenseId, LocalDate regDate, LocalDate occDate, String desc, String corpName, Long settleAmt,
                             LocalDate dueDate, String payMethodName, String payAccountInfo, String fileCountStr, String confirmerName,
                             String confirmStatusCode, String confirmStatusName, String expenseStatusName, String settleApprStatusName,
                             String rejectReason, String confirmReason) {
}
