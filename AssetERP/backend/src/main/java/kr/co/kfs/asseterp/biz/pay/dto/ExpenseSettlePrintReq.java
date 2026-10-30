package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** [엑셀다운로드] — 화면 조회 조건 (AS-IS insertRdExpensePay) */
public record ExpenseSettlePrintReq(
        LocalDate startDate,
        LocalDate closeDate,
        String expenseCode,
        String payYnCode,
        boolean statusCheckYn,
        String searchText
) {
}
