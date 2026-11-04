package kr.co.kfs.asseterp.biz.batch.dto;

/** 가장 최근 크롤링(sch13) 중 일정 반영에 쓰는 열 (AS-IS sch13_ipo_crawling.selectByTrackId) */
public record BatchIpoCrawlRow(
        String trackId, String stkCode, String stkName, String marketType, String priceBracket,
        String leadManager, String demandDate, String subscriptionDate, String divDate, String payDate,
        String refundDate, String listDate, String finalPrice
) {
}
