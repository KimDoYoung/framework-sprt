package kr.co.kfs.asseterp.biz.biz.dto;

/** Biz01_Edit_Card [저장] — 제공목적·제공내역·계정과목·비고 (AS-IS modelUpdate가 바꾸는 열) */
public record BizPromoUpdateReq(String providePurCode, String provideContentCode, Long accountCodeId, String note) {
}
