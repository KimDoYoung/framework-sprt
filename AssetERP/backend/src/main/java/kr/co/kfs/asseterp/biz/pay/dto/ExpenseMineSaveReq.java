package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/**
 * 지출요청 등록·수정 (AS-IS pay.Pay50_Expense.modelUpdate) — 등록자·등록일은 서버가 정한다.
 * pass가 true면 [바로등록](승인상태 80, 승인자·결의자 = 로그인 사원)
 */
public record ExpenseMineSaveReq(String expenseCode, LocalDate occDate, String desc, String content, Long corpId, String taxType, Long amt, Long tax,
                                 Long settleAmt, LocalDate dueDate, String payMethodCode, String payAccountInfo, Long confirmerId,
                                 String accountCode, Long astId, Long depositId, boolean pass) {
}
