package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 판촉물 제공내역 한 행 (AS-IS Biz01_PromoModel — Biz01_TabPage_List 그리드) */
public record BizBuyPromoRes(
        Long promoId,
        Long buyId,
        LocalDate provideDate,
        String provideContentCode,
        String provideContentName,
        String providePurCode,
        String providePurName,
        String targetCompanyName,
        String targetEmpName,
        String note
) {
}
