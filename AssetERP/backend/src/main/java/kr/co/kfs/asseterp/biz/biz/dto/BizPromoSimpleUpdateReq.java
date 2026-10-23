package kr.co.kfs.asseterp.biz.biz.dto;

/** Biz01_Edit_CardSimple [저장] — 제공목적·제공내역·계정과목·거래상대방·인원·비고 (AS-IS modelUpdate가 바꾸는 열) */
public record BizPromoSimpleUpdateReq(String providePurCode, String provideContentCode, Long accountCodeId,
                                      String provideCompany, Long pepleCount, String note) {
}
