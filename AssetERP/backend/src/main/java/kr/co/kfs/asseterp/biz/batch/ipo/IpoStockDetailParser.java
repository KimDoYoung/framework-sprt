package kr.co.kfs.asseterp.biz.batch.ipo;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * AS-IS utils/scraper/IpoDetailPageParser — IPOStock 종목 상세 페이지(view_04.asp) 한 장을 sch13 한 행으로 바꾼다.
 * 선택자와 문구(오타 '납일일' 포함)를 AS-IS 그대로 쓴다. 못 찾은 항목은 빈 문자열, 철회 표시가 없으면 상태는 null.
 */
public final class IpoStockDetailParser {

    private IpoStockDetailParser() {
    }

    /** trackId는 부른 쪽이 정해 준다(AS-IS는 IpoScraper.run에서 넣는다). 구분은 '2'(IPO-Stock) */
    public static BatchIpoCrawling parse(Document doc, String trackId) {
        String marketType = null;
        String status = null;
        Element header = findHeaderTable(doc);
        if (header != null) {
            marketType = findMarketTypeInHeaderTable(header);
            status = findStatusInHeaderTable(header);
        }

        String demandDate = null;
        String subscriptionDate = null;
        String refundDate = null;
        String payDate = null;
        String listDate = null;
        Element schedule = findScheduleTable(doc);
        if (schedule != null) {
            demandDate = findInElement(schedule, "td:contains(수요예측일) + td");
            subscriptionDate = findInElement(schedule, "td:contains(공모청약일) + td");
            refundDate = findInElement(schedule, "td:contains(환불일) + td");
            payDate = findInElement(schedule, "td:contains(납일일) + td");
            if (payDate == null || payDate.isEmpty()) {
                payDate = findInElement(schedule, "td:contains(납입일) + td");
            }
            listDate = findInElement(schedule, "td:contains(상장일) + td");
        }

        return new BatchIpoCrawling(
                trackId,
                findWithCssQuery(doc, "strong.view_tit"),                     // 종목명
                status,                                                        // 진행상황(철회여부)
                marketType,                                                    // 시장구분
                findWithCssQuery(doc, "strong.view_txt01"),                   // 종목코드
                null,
                findWithCssQuery(doc, "td:contains(대표이사) + td"),          // 대표자
                null, null, null,
                findWithCssQuery(doc, "td:contains(대표전화) + td"),          // 대표전화
                null, null, null, null, null,
                findWithCssQuery(doc, "td:contains(공모주식수) + td"),        // 총공모주식수
                findWithCssQuery(doc, "td:contains(액면가) + td"),            // 액면가
                null,
                findWithCssQuery(doc, "td:contains((희망)공모가격) + td"),    // 희망공모가액
                findWithCssQuery(doc, "td:contains(청약경쟁률) + td"),        // 청약경쟁률
                findWithCssQuery(doc, "td:contains((확정)공모가격) + td"),    // 확정공모가
                findWithCssQuery(doc, "td:contains((확정)공모금액) + td"),    // 공모금액
                findLeadManager(doc),                                          // 주간사
                demandDate, subscriptionDate,
                null,
                payDate, refundDate, listDate,
                null, null, null, null, null,
                BatchIpoCrawling.TARGET_IPOSTOCK);
    }

    private static String findWithCssQuery(Document doc, String cssQuery) {
        Element elm = doc.selectFirst(cssQuery);
        return elm != null ? elm.text().replaceAll(" ", " ") : "";
    }

    private static String findLeadManager(Document doc) {
        StringBuilder leadManager = new StringBuilder();
        for (Element table : doc.select("table.view_tb")) {
            // 첫 <tr>이 '증권회사, 배정수량...'인 표
            Element headerRow = table.selectFirst("tr");
            if (headerRow != null && headerRow.text().contains("증권회사")) {
                int i = 0;
                for (Element tr : table.select("tr")) {
                    if (i > 0) {
                        Elements tds = tr.select("td");
                        leadManager.append(tds.get(0).text()).append(',');   // td가 없으면 AS-IS처럼 IndexOutOfBounds
                    }
                    i++;
                }
                if (leadManager.length() > 0 && leadManager.charAt(leadManager.length() - 1) == ',') {
                    leadManager.setLength(leadManager.length() - 1);
                }
                break;
            }
        }
        return leadManager.toString();
    }

    private static Element findScheduleTable(Document doc) {
        for (Element table : doc.select("table.view_tb")) {
            Element firstRowFirstTd = table.selectFirst("tr:first-of-type td:first-of-type");
            if (firstRowFirstTd != null && firstRowFirstTd.text().contains("대규모 IR일정")) {
                return table;
            }
        }
        return null;
    }

    private static Element findHeaderTable(Document doc) {
        Element mainTable = doc.selectFirst("table");
        if (mainTable == null) {
            return null;
        }
        return mainTable.selectFirst("table[width='561']:has(td:has(strong.view_tit))");
    }

    /** 헤더 표의 이미지로 시장구분을 정한다: co.gif 코스닥 / u.gif 유가증권 / f.jpg 코넥스 */
    private static String findMarketTypeInHeaderTable(Element table) {
        Element img = table.selectFirst("img");
        String imgSrc = img.attr("src");   // 이미지가 없으면 AS-IS처럼 NullPointerException
        if (imgSrc.contains("co.gif")) {
            return "코스닥";
        } else if (imgSrc.contains("u.gif")) {
            return "유가증권";
        } else if (imgSrc.contains("f.jpg")) {
            return "코넥스";
        }
        return "Unknown";
    }

    private static String findStatusInHeaderTable(Element table) {
        for (Element td : table.select("td[align=right][valign=bottom]")) {
            if (td.text().trim().contains("공모철회")) {
                return "공모철회";
            }
        }
        return null;
    }

    private static String findInElement(Element elm, String cssQuery) {
        Element found = elm.selectFirst(cssQuery);
        return found != null ? found.text() : "";
    }
}
