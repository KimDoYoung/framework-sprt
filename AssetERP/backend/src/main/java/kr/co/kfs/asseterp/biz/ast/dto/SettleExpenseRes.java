package kr.co.kfs.asseterp.biz.ast.dto;

/** 결제등록 창이 쓰는 지출결의서 정보 (AS-IS Pay50_ExpenseModel 중 desc·unSettleAmt·depositId·depositName) */
public record SettleExpenseRes(Long expenseId, Long companyId, String desc, Long settleAmt, Long unSettleAmt, Long depositId, String depositName) {
}
