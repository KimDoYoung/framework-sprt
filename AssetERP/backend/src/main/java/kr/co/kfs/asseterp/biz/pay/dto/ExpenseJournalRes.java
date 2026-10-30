package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 사업비 회계처리 한 행 (AS-IS pay50_expense.selectExpenseJournal — 전표 단위로 묶은 지출결의 내역). expenseId는 행번호(row_number)일 뿐 지출결의서 ID가 아니다 */
public record ExpenseJournalRes(
        Long expenseId,
        Long companyId,
        LocalDate occDate,
        String expenseCode,
        String expenseName,
        String desc,
        String corpName,
        Long amt,
        Long tax,
        Long settleAmt,
        String payMethodName,
        String fileCountStr,
        Long journalId,
        Long journalNo,
        Boolean journalFixYn
) {
}
