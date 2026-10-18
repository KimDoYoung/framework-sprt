package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PayTaxDeductSaveReq(Long taxDeductTableId, LocalDate startDate, Long fromAmt, Long toAmt, Long deductAmt, Double rate, String note) {
}
