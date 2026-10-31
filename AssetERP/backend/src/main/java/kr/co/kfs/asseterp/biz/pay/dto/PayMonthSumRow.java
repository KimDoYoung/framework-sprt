package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여대장 합계 (AS-IS Pay10_MonthModel, pay10_month.selectBypayCode — V25) */
public record PayMonthSumRow(Long paySum, Long taxDdcSum, Long deductionSum) {
}
