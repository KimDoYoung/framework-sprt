package kr.co.kfs.asseterp.biz.pay.dto;

/** 지출요청 등록창의 첫 값 (AS-IS pay50_expense.getConfirmerId) — 승인자(요청자의 상위 부서장)와 회사의 기본 면세구분 */
public record ExpenseConfirmerRes(Long confirmerId, String confirmerName, String taxType, String taxTypeName) {
}
