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

    /** 회계처리 쪽 새 행 INSERT — 자금집행일(settleDate)은 비우고 계정과목은 accountCode로 한다 (AS-IS는 insertModel에 이 값들을 넣지 않는다) */
    public ExpenseNewRes forJournal(String accountCode) {
        return new ExpenseNewRes(expenseId, companyId, expenseCode, expenseName, occDate, dueDate, desc, corpId, corpName,
                payMethodCode, payMethodName, payAccountInfo, taxType, amt, tax, settleAmt, apprEmpId, expenseApprId, benefitId,
                transportStdYm, bizCardStdYm, bizCardCorpCode, depositId, null, accountCode, accountName, trId);
    }
}
