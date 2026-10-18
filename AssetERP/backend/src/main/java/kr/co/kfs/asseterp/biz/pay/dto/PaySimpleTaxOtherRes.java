package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로소득 간이세액표 천만원 초과(pay23) 한 행 */
public record PaySimpleTaxOtherRes(Long simpleTaxTableOtherId, LocalDate startDate, Long fromAmt, Long toAmt,
                                   Double rate1, Double rate2, Long addTax, String note) {
}
