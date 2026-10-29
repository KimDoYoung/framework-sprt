package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 지출요청내역 한 행 (AS-IS selectExpenseRequest — 승인된 사업비요청 + 발송완료된 화환신청) */
public record ExpenseRequestRes(
        Long expenseId,
        Long companyId,
        String expenseCode,
        String expenseName,
        Long regEmpId,
        String regEmpOrgName,
        LocalDate regDate,
        LocalDate occDate,
        String desc,
        Long settleAmt,
        LocalDate dueDate,
        Long corpId,
        String corpName,
        Long floralId
) {
}
