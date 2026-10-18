package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PaySimpleTaxOtherSaveReq(Long simpleTaxTableOtherId, LocalDate startDate, Long fromAmt, Long toAmt,
                                       Double rate1, Double rate2, Long addTax, String note) {
}
