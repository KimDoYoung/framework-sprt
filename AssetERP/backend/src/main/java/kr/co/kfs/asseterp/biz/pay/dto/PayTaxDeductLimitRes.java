package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로소득 세액공제 한도(pay28) 한 행 */
public record PayTaxDeductLimitRes(Long taxDeductLimitId, LocalDate startDate, Long fromAmt, Long toAmt, Long minLimit, Long maxLimit,
                                   Double rate, String note) {
}
