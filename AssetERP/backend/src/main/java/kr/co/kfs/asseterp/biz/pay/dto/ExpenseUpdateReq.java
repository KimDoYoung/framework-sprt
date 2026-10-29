package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 지출결의서 저장 (AS-IS Pay50_Edit_Expense.update) — 화면이 바꾸는 열만 */
public record ExpenseUpdateReq(
        LocalDate occDate,
        String desc,
        Long corpId,
        String taxType,
        Long amt,
        Long tax,
        Long settleAmt,
        LocalDate dueDate,
        String payMethodCode,
        String payAccountInfo,
        String accountCode,
        String note,
        Long depositId,
        Long astId
) {
}
