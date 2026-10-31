package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 법인카드 사용내역 엑셀 한 행 (AS-IS biz01_promo.selectByCardExcel → Biz01_PromoModel, A41 상신 첨부 Biz01_Excel.getCardExcel) */
public record BizCardExcelRow(
        String htmlCardName,
        String cardUserName,
        LocalDateTime approvalDt,
        String franchiseName,
        String sectorName,
        Long provideAmt,
        String providePurName,
        String provideContentName,
        String accountName,
        String accountCode,
        Long totalPeple,
        Long averagePrice,
        String regEmpName,
        String targetName,
        String note
) {
}
