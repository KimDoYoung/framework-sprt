package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 자금집행결의서 조회 아래 그리드 한 행 (AS-IS selectBySettleApprId) */
public record ExpenseSettleApprRowRes(
        Long expenseId,
        Long expenseApprId,
        LocalDate occDate,
        String expenseName,
        String desc,
        String corpName,
        String tel,
        String addr,
        Long settleAmt,
        String payMethodName
) {
}
