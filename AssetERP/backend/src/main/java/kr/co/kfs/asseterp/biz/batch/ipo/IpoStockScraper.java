package kr.co.kfs.asseterp.biz.batch.ipo;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS utils/scraper/IpoScraper — IPOStock 목록(연도별, 3쪽)에서 종목코드를 모으고 코드마다 상세 페이지를 읽어 파싱한다.
 * 같은 코드가 목록에 여러 번 나오면 그만큼 중복해서 읽는다(AS-IS 그대로).
 */
@Slf4j
public class IpoStockScraper {

    static final int PAGE_COUNT = 3;

    private final IpoPageFetcher fetcher;
    private final String baseUrl;

    public IpoStockScraper(IpoPageFetcher fetcher, String baseUrl) {
        this.fetcher = fetcher;
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    /** 한 연도의 공모주 일정 전체 */
    public List<BatchIpoCrawling> scrap(String year, String trackId) throws IOException {
        String startUrl = baseUrl + "/sub03/ipo04.asp?str1=" + year + "&str2=all&str3=&str4=";
        log.info("startUrl : {}", startUrl);

        List<BatchIpoCrawling> result = new ArrayList<>();
        for (String code : scrapPageAnchor(startUrl)) {
            Document doc = fetcher.fetch(baseUrl + "/view_pg/view_04.asp?code=" + code);
            result.add(IpoStockDetailParser.parse(doc, trackId));
        }
        return result;
    }

    private List<String> scrapPageAnchor(String startUrl) throws IOException {
        List<String> list = new ArrayList<>();
        for (int i = 1; i <= PAGE_COUNT; i++) {
            Document doc = fetcher.fetch(startUrl + "&page=" + i);
            for (Element anchor : doc.select("a[href*=/view_pg/view_]")) {
                String href = anchor.attr("href");
                list.add(href.split("code=")[1].split("&")[0]);   // code= 가 없으면 AS-IS처럼 오류
            }
        }
        return list;
    }
}
