package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * Biz01_TabPage_List [저장] (AS-IS Biz01_Promo.updateAdd) — promoId ≤ 0이면 새 행.
 * 고친 행은 제공일자·목적·비고만 바뀌고, 새 행은 구매내역에서 넘겨받은 값(구매ID·품목·금액·담당자)이 함께 온다
 */
public record BizBuyPromoSaveReq(
        Long promoId,
        Long buyId,
        LocalDate provideDate,
        String provideContentCode,
        String providePurCode,
        Long provideAmt,
        Long personId,
        String targetCompanyName,
        String targetEmpName,
        String note
) {
}
