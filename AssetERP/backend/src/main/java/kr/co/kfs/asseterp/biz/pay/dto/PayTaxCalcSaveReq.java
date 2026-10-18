package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PayTaxCalcSaveReq(Long taxCalcTableId, LocalDate startDate, Long fromAmt, Long toAmt, Long basicTax, Double rate, String note) {
}
