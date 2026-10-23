package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 현금·물품 이익제공(수령) 한 행 (AS-IS Biz01_PromoModel — Biz01_Tab_Other 그리드·Biz01_Edit_Other 입력, 간이판 Biz01_Tab_OtherSimple은 끝의 거래상대방·인원·인당 경제적가치도 쓴다) */
public record BizPromoOtherRes(
        Long promoId,
        String provideRcvType,
        String provideRcvTypeName,
        LocalDate provideDate,
        String providePurCode,
        String providePurName,
        String provideContentCode,
        String provideContentName,
        Long provideAmt,
        Long totalPeple,
        Long averagePrice,
        String note,
        String provideCompany,
        Long pepleCount,
        Long averagePrice2
) {
}
