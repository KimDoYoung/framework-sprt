package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 자금집행결의서 작성 한 행 (AS-IS selectExpensePay — 자금집행 대상이 된 결재완료 지출결의서) */
public record ExpenseSettleRes(
        Long expenseId,
        Long companyId,
        String expenseCode,
        String expenseName,
        String desc,
        Long corpId,
        String corpName,
        String tel,
        String addr,
        LocalDate dueDate,
        Long settleAmt,
        String payMethodCode,
        String payMethodName,
        String payAccountInfo,
        LocalDate settleDate,
        Long depositId,
        String depositName,
        String settleNote,
        Long journalId,
        Long expenseApprId,
        String expenseApprStatusCode,
        Long settleApprId,
        String settleApprStatusCode,
        String settleApprStatusName,
        Boolean payYn
) {
}
