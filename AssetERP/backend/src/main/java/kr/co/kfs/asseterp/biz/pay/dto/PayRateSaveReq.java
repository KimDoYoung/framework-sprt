package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 율관리 저장 한 행 — rateId가 0 이하이거나 DB에 없으면 등록 */
public record PayRateSaveReq(Long rateId, String rateCode, LocalDate startDate, Double applyRate, String note) {
}
