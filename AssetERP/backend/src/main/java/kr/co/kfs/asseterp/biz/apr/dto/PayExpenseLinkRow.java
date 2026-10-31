package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A63 지출결의서·A64 자금집행결의서 본문이 쓰는 지출요청 행 (AS-IS Pay50_ExpenseModel 중 ExpenseHtmlData가 읽는 속성만, V27) */
public record PayExpenseLinkRow(Long expenseId, LocalDate occDate, String desc, String content, String corpName,
                                Long amt, Long tax, Long settleAmt, String taxTypeName, LocalDate dueDate,
                                String payMethodCode, String payMethodName, String payAccountInfo, String note,
                                String regEmpTitleName, String regEmpOrgName, String confirmerTitleName, String confirmerOrgName,
                                String orgName, String accountName, String depositName, LocalDate settleDate) {
}
