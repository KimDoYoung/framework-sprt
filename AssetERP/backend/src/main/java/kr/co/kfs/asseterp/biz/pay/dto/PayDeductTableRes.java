package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로소득 공제표(pay24) 한 행 — dataCode 1: 공제한도(limitAmt), 2: 공제표 구간 */
public record PayDeductTableRes(Long deductTableId, LocalDate startDate, String dataCode, Long limitAmt, Long fromAmt, Long toAmt,
                                Long deductAmt, Double deductRate, String note) {
}
