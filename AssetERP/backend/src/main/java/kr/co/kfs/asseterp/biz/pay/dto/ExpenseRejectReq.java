package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** 반려 (AS-IS pay.Pay50_Expense.updateRejectReason) — 사유가 없으면 반려취소 */
public record ExpenseRejectReq(List<Long> ids, String rejectReason) {
}
