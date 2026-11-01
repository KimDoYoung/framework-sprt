package kr.co.kfs.asseterp.biz.pay.dto;

/** 반려건 일괄 알림발송 대상 — 요청자별 미발송 반려 건수 (AS-IS pay50_expense.getConfirmSendMessageList) */
public record ExpenseConfirmSendRow(Long regEmpId, Integer count) {
}
