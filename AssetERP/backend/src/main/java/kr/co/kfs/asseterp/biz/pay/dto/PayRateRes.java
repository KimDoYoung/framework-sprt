package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 율관리(pay21_rate) 한 행 — 율 구분 이름은 f_cdnm */
public record PayRateRes(Long rateId, String rateCode, LocalDate startDate, Double applyRate, String note, String rateName) {
}
