package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 자금집행결의서 작성 [저장] — 화면이 바꾸는 열 5개 (AS-IS UpdateDataModel(pay50_expense) → updateModel) */
public record ExpenseSettleSaveReq(
        Long expenseId,
        String payMethodCode,
        String payAccountInfo,
        LocalDate settleDate,
        Long depositId,
        String settleNote
) {
}
