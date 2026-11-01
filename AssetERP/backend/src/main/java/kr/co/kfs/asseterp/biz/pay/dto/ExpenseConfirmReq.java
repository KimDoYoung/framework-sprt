package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/**
 * 승인(20)·반려(30)·취소(10) (AS-IS pay.Pay50_Expense.updateConfirmReason) — 반려일 때만 사유가 있고,
 * 승인일자는 승인·반려일 때 오늘, 취소는 비운다(AS-IS는 클라이언트가 보냈다)
 */
public record ExpenseConfirmReq(List<Long> ids, String confirmStatusCode, String confirmReason) {
}
