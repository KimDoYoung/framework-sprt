package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 비품 지출결의서 선택 한 줄 (pay50_expense.selectOfficeAssets) */
public record ExpenseOfficeRes(Long expenseId, LocalDate occDate, String desc, Long corpId, String corpName, Long amt, Long tax, Long settleAmt) {
}
