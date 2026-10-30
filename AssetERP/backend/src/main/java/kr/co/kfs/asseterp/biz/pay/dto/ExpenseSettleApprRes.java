package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 자금집행결의서 조회 위 그리드 한 행 (AS-IS selectBySettleDate — 집행결의서 상신 단위로 묶은 것) */
public record ExpenseSettleApprRes(
        Long expenseId,
        LocalDate settleDate,
        String settleApprTitle,
        String count,
        Long settleAmt,
        String settleApprStatusName,
        Long settleApprId
) {
}
