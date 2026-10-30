package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * 미수/미지급 결제등록 (AS-IS ast.Ast07_Settle.update 의 settleModel) — 새 결제 한 건.
 * expenseId가 있으면 지출결의서(9100) 결제, 없으면 trId 거래의 결제. amt = 미수/미지급금액, settleAmt = 결제금액
 */
public record SettleSaveReq(Long expenseId, Long trId, @NotNull LocalDate settleDate, String note, Long depositId, @NotNull String trCode,
                            @NotNull Long amt, @NotNull Long settleAmt) {
}
