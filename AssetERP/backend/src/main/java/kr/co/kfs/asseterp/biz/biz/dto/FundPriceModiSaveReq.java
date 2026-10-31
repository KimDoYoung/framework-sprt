package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 기준가 정정내역 보고 저장 (AS-IS Biz60_FundPriceModi.modelUpdate — 편집창 입력값 전부). fundPriceModiId는 편집창이 먼저 받아 둔 번호다 */
public record FundPriceModiSaveReq(
        Long fundPriceModiId, String reportType, String amCorpName, String fundName,
        LocalDate priceStdDate, LocalDate modiDate, Boolean fundCloseYn,
        Double befPrice, Double befFullPrice, Double befTaxPrice, Double befFullTaxPrice, Double befClosePrice, Double befCloseFullPrice, Double befCloseTaxPrice, Double befCloseFullTaxPrice,
        Double aftPrice, Double aftFullPrice, Double aftTaxPrice, Double aftFullTaxPrice, Double aftClosePrice, Double aftCloseFullPrice, Double aftCloseTaxPrice, Double aftCloseFullTaxPrice,
        String firstPersonName, String discCause, String modiReason, String prevPlan,
        Boolean ksdNoticeYn, Boolean kofiaNoticeYn, Double cmpsAmt) {
}
