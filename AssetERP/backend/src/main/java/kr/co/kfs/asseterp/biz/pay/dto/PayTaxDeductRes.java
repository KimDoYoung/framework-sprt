package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로소득 세액공제(pay27) 한 행 */
public record PayTaxDeductRes(Long taxDeductTableId, LocalDate startDate, Long fromAmt, Long toAmt, Long deductAmt, Double rate, String note) {
}
