package kr.co.kfs.asseterp.biz.biz.dto;

/** Biz01_Edit_Account [저장] (AS-IS Biz01_Promo.modelUpdate) — 화면이 바꾸는 6열. realPersonId가 없으면 '공통' */
public record BizCardManagementUpdateReq(String providePurCode, String provideContentCode, Long accountCodeId,
                                         String note, String taxType, Long realPersonId) {
}
