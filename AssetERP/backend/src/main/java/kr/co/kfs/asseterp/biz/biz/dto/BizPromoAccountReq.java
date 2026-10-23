package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** Biz01_Lookup_CardManagement [저장] (AS-IS biz.Biz01_Promo.updateAccount). withTax=false면 과세구분 없이(updateAccount02, 법인카드 화면), true면 과세구분까지(updateAccount01) */
public record BizPromoAccountReq(List<Long> promoIds, String providePurCode, String provideContentCode, Long accountId,
                                 String taxType, String note, boolean withTax) {
}
