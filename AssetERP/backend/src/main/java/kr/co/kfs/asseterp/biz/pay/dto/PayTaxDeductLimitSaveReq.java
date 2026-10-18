package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PayTaxDeductLimitSaveReq(Long taxDeductLimitId, LocalDate startDate, Long fromAmt, Long toAmt, Long minLimit, Long maxLimit,
                                       Double rate, String note) {
}
