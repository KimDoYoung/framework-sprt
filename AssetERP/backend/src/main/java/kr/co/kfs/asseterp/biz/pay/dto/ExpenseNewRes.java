package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 신규 자금집행 예정내역 한 행 (AS-IS selectNewExpenseAppr — 10/20/90/91 지출요청 + 복리후생·여비교통·법인카드·세금·4대보험·급여) */
public record ExpenseNewRes(
        Long expenseId,
        Long companyId,
        String expenseCode,
        String expenseName,
        LocalDate occDate,
        LocalDate dueDate,
        String desc,
        Long corpId,
        String corpName,
        String payMethodCode,
        String payMethodName,
        String payAccountInfo,
        String taxType,
        Long amt,
        Long tax,
        Long settleAmt,
        Long apprEmpId,
        Long expenseApprId,
        Long benefitId,
        String transportStdYm,
        String bizCardStdYm,
        String bizCardCorpCode,
        Long depositId,
        LocalDate settleDate,
        String accountCode,
        String accountName,
        Long trId
) {
}
