package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 사업비 지출승인(부서장) 목록 한 행 (AS-IS pay50_expense.selectByDateConfirm — Pay50_Tab_ExpenseConfirm 그리드가 쓰는 열) */
public record ExpenseConfirmRes(
        Long expenseId,
        LocalDate occDate,
        Long regEmpId,
        String regEmpName,
        String desc,
        String content,
        String contentStatusName,
        String corpName,
        Long settleAmt,
        LocalDate dueDate,
        String payMethodName,
        String payAccountInfo,
        String fileCountStr,
        String confirmStatusCode,
        String confirmStatusName,
        String confirmReason,
        Long apprEmpId) {
}
