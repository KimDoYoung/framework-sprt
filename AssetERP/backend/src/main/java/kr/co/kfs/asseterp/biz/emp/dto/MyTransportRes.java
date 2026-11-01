package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y07 여비교통비 한 줄 (AS-IS Emp50_TransportExpenseModel — emp50_transport_expense.selectByYearMonth) */
public record MyTransportRes(Long transportExpenseId, Long personId, String yyyymm, LocalDate date, String startPoint, String closePoint,
                             String startTime, String closeTime, Long amt, String transportCode, String transportName, String note,
                             String receiptStr, Long fileId) {
}
