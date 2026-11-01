package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * 미수/미지급 결제등록 (AS-IS ast.Ast07_Settle.update 의 settleModel) — 새 결제 한 건.
 * expenseId가 있으면 지출결의서(9100) 결제, 없으면 trId 거래의 결제. amt = 미수/미지급금액, settleAmt = 결제금액
 * 외화 결제(X08 Ast07_Lookup_ForSettle)는 forAmt(외화 미수/미지급금액)·forSettleAmt(외화 결제금액)·fxRate(적용환율)를 보낸다 — forAmt가 있으면 외화 결제.
 * 이때 amt는 비어도 된다(원화 미수/미지급금액은 서버가 원거래에서 다시 계산한다)
 */
public record SettleSaveReq(Long expenseId, Long trId, @NotNull LocalDate settleDate, String note, Long depositId, @NotNull String trCode,
                            Long amt, @NotNull Long settleAmt, Double forAmt, Double forSettleAmt, Double fxRate) {
}
