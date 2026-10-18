package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PayDeductTableSaveReq(Long deductTableId, LocalDate startDate, Long fromAmt, Long toAmt, Long deductAmt, Double deductRate, String note) {
}
