package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 법인카드 이익제공(수령) 한 행 (AS-IS Biz01_PromoModel — Biz01_Tab_Card 그리드·Biz01_Edit_Card 입력, 간이판 Biz01_Tab_CardSimple은 끝의 거래상대방·인원·인당 경제적가치도 쓴다). closeName은 마감이면 '마감' */
public record BizPromoCardRes(
        Long promoId,
        Boolean closeYn,
        String closeName,
        String htmlCardName,
        LocalDateTime approvalDt,
        String franchiseName,
        String sectorName,
        Long approvalAmount,
        String providePurCode,
        String providePurName,
        String provideContentCode,
        String provideContentName,
        Long accountCodeId,
        String accountName,
        Long totalPeple,
        Long averagePrice,
        String note,
        String provideCompany,
        Long pepleCount,
        Long averagePrice2
) {
}
