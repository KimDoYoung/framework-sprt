package kr.co.kfs.asseterp.biz.bmt.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 판촉물 구매내역 한 행 (AS-IS Bmt01_BuyModel — Bmt01_Tab_Buy 그리드) */
public record BmtBuyRes(
        Long buyId,
        LocalDate buyDate,
        String provideContentCode,
        String provideContentName,
        Long buyQty,
        Long buyAmt,
        Long totalPeple,
        BigDecimal averagePrice,
        Long leftQty,
        Long personId,
        String personName,
        Long apprId,
        String apprStatusName
) {
}
