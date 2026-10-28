package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여명세서 목록 한 행 — pay10_month.selectByYearPersonId (S20·S21) */
public record PayMonthPersonRes(Long monthId, LocalDate date, String payName, Long deductionSum, Long paySum, Long incomeTaxSum) {
}
