package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 과세표준 구간별 기본세율(pay26) 한 행 */
public record PayTaxCalcRes(Long taxCalcTableId, LocalDate startDate, Long fromAmt, Long toAmt, Long basicTax, Double rate, String note) {
}
