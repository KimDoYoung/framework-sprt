package kr.co.kfs.asseterp.biz.batch.dto;

/** 승인자별 사업비지출 승인요청 건수 (AS-IS pay50_expense.getExpenseRequestCount) */
public record BatchExpenseRequest(Long confirmerId, Long requestCnt) {
}
