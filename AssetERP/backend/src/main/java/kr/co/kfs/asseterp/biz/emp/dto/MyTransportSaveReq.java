package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y07 그리드 저장 한 줄 (AS-IS Emp50_TransportExpense.update/copyUpdate — transportExpenseId 0 이하는 새 행) */
public record MyTransportSaveReq(Long transportExpenseId, String yyyymm, LocalDate date, String startPoint, String closePoint,
                                 String startTime, String closeTime, Long amt, String transportCode, String note) {
}
