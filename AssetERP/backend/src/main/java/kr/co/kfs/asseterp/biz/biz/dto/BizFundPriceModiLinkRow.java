package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * 기준가 정정 보고 한 건 (AS-IS Biz60_FundPriceModiModel — 결재창 A75~A77 본문에 쓰는 열만).
 * fundCloseYn·ksdNoticeYn·kofiaNoticeYn은 DB가 'true'/'false' 글자다(AS-IS 모델은 Boolean).
 */
public record BizFundPriceModiLinkRow(
        Long fundPriceModiId, String reportType, String amCorpName, String fundName,
        LocalDate priceStdDate, LocalDate modiDate, String fundCloseYn,
        Double befPrice, Double befFullPrice, Double befTaxPrice, Double befFullTaxPrice,
        Double aftPrice, Double aftFullPrice, Double aftTaxPrice, Double aftFullTaxPrice,
        Double befClosePrice, Double befCloseFullPrice, Double befCloseTaxPrice, Double befCloseFullTaxPrice,
        Double aftClosePrice, Double aftCloseFullPrice, Double aftCloseTaxPrice, Double aftCloseFullTaxPrice,
        String firstPersonName, String discCause, String modiReason, String prevPlan,
        String ksdNoticeYn, String kofiaNoticeYn, Double cmpsAmt, String fileListHtmlStr) {
}
