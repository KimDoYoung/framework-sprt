package kr.co.kfs.asseterp.biz.batch.dto;

/**
 * sch13_ipo_crawling 한 행 (AS-IS Sch13_IpoCrawlingModel). 필드 순서는 sch13_ipo_crawling.insert의 값 순서와 같다.
 * 공모주 38(33열)과 IPO Stock(18열)이 같은 테이블을 쓰므로 안 쓰는 열은 null이다.
 */
public record BatchIpoCrawling(
        String trackId, String stkName, String status, String marketType, String stkCode,
        String industry, String ceo, String bizType, String addr, String website, String phone,
        String majorShareholder, String revenue, String bizProfit, String netProfit, String capital,
        String totalIpoQty, String par, String listIpoQty, String priceBracket, String subscriptionRate,
        String finalPrice, String ipoOfferAmt, String leadManager, String demandDate, String subscriptionDate,
        String divDate, String payDate, String refundDate, String listDate, String irDate,
        String irLocationTime, String corpRate, String lockUpRate, String demandCorpCnt, String targetType
) {
    public static final String TARGET_IPO38 = "1";
    public static final String TARGET_IPOSTOCK = "2";

    /** IPO Stock 119서버 전달 데이터 18열 (AS-IS ipoScrap) — 구분 '2' */
    public static BatchIpoCrawling ofIpoStock(String trackId, String[] c) {
        return new BatchIpoCrawling(
                trackId, c[0].trim(), c[1].trim(), c[2].trim(), c[3].trim(),
                null, c[4].trim(), null, null, null, c[5].trim(),
                null, null, null, null, null,
                c[6].trim(), c[7].trim(), null, c[8].trim(), c[9].trim(),
                c[10].trim(), c[11].trim(), c[12].trim(), c[13].trim(), c[14].trim(),
                null, c[15].trim(), c[16].trim(), c[17].trim(), null,
                null, null, null, null, TARGET_IPOSTOCK);
    }

    /** 공모주38 119서버 전달 데이터 33열 (AS-IS ipo38Scrap) — 구분 '1' */
    public static BatchIpoCrawling ofIpo38(String trackId, String[] c) {
        return new BatchIpoCrawling(
                trackId, c[0].trim(), c[1].trim(), c[2].trim(), c[3].trim(),
                c[4].trim(), c[5].trim(), c[6].trim(), c[7].trim(), c[8].trim(), c[9].trim(),
                c[10].trim(), c[11].trim(), c[12].trim(), c[13].trim(), c[14].trim(),
                c[15].trim(), c[16].trim(), c[17].trim(), c[18].trim(), c[19].trim(),
                c[20].trim(), c[21].trim(), c[22].trim(), c[23].trim(), c[24].trim(),
                c[25].trim(), c[26].trim(), c[27].trim(), c[28].trim(), c[29].trim(),
                c[30].trim(), c[31].trim(), c[32].trim(), null, TARGET_IPO38);
    }
}
