package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** [요청하기]·[요청취소] (AS-IS pay.Pay50_Expense.updateConfirmStatusCode) — request가 true면 승인상태 10, false면 비운다 */
public record ExpenseMineStatusReq(List<Long> ids, boolean request) {
}
