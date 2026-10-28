package kr.co.kfs.asseterp.biz.emp.dto;

/** 그리드에서 고친 결과보고서 면제 (AS-IS Emp53_BizTrip.update 의 고치는 열 — 여부·사유) */
public record BizTripSaveReq(Long bizTripId, Boolean resultSkipYn, String skipReason) {
}
