package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.ScrapingIpoAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.ipo.BatchIpoService;
import kr.co.kfs.asseterp.biz.batch.ipo.IpoPageFetcher;
import kr.co.kfs.asseterp.biz.batch.ipo.IpoStockDetailParser;
import kr.co.kfs.asseterp.biz.batch.ipo.IpoStockScraper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** SB27 scrapingIpo: 저장한 HTML 샘플로 파서·스크래퍼를 시험하고, 저장은 asseterpdb에서 롤백한다(외부 사이트 접속 없음) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(BatchIpoService.class)
class ScrapingIpoTest {

    @Autowired BatchIpoService ipoService;
    @Autowired JdbcTemplate jdbc;

    /** URL을 샘플 파일로 바꿔 주는 가짜 페이지 읽기. 요청한 URL을 모아 둔다 */
    static class FakeFetcher implements IpoPageFetcher {
        final List<String> urls = new ArrayList<>();

        @Override
        public Document fetch(String url) throws IOException {
            urls.add(url);
            String name = url.contains("/sub03/ipo04.asp") ? "list.html"
                    : "detail-" + url.substring(url.indexOf("code=") + 5) + ".html";
            try (InputStream in = getClass().getResourceAsStream("/ipostock/" + name)) {
                if (in == null) {
                    throw new IOException("샘플 없음: " + name);
                }
                return Jsoup.parse(new String(in.readAllBytes(), StandardCharsets.UTF_8));
            }
        }
    }

    private static Document sample(String name) throws IOException {
        try (InputStream in = ScrapingIpoTest.class.getResourceAsStream("/ipostock/" + name)) {
            return Jsoup.parse(new String(in.readAllBytes(), StandardCharsets.UTF_8));
        }
    }

    @Test
    void 상세_페이지에서_항목을_뽑는다() throws Exception {
        BatchIpoCrawling c = IpoStockDetailParser.parse(sample("detail-ZZ001.html"), "T1");

        assertThat(c.trackId()).isEqualTo("T1");
        assertThat(c.stkName()).isEqualTo("시뮬공모A");
        assertThat(c.stkCode()).isEqualTo("ZZ001");
        assertThat(c.marketType()).isEqualTo("코스닥");
        assertThat(c.status()).isNull();
        assertThat(c.ceo()).isEqualTo("홍길동");
        assertThat(c.phone()).isEqualTo("02-000-0000");
        assertThat(c.totalIpoQty()).isEqualTo("1,000,000주");
        assertThat(c.par()).isEqualTo("500원");
        assertThat(c.priceBracket()).isEqualTo("10,000~12,000원");
        assertThat(c.subscriptionRate()).isEqualTo("1,234.5 : 1");
        assertThat(c.finalPrice()).isEqualTo("12,000원");
        assertThat(c.ipoOfferAmt()).isEqualTo("120억원");
        assertThat(c.leadManager()).isEqualTo("시뮬증권,가상투자증권");
        assertThat(c.demandDate()).isEqualTo("2026.11.03~2026.11.04");
        assertThat(c.subscriptionDate()).isEqualTo("2026.11.10~2026.11.11");
        assertThat(c.payDate()).isEqualTo("2026.11.13");
        assertThat(c.refundDate()).isEqualTo("2026.11.13");
        assertThat(c.listDate()).isEqualTo("2026.11.20");
        assertThat(c.targetType()).isEqualTo("2");
    }

    @Test
    void 공모철회와_유가증권을_알아보고_납입일_오타_표기도_읽는다() throws Exception {
        BatchIpoCrawling c = IpoStockDetailParser.parse(sample("detail-ZZ002.html"), "T1");

        assertThat(c.status()).isEqualTo("공모철회");
        assertThat(c.marketType()).isEqualTo("유가증권");
        assertThat(c.payDate()).isEqualTo("2026.11.20");
        assertThat(c.ceo()).isEmpty();
        assertThat(c.leadManager()).isEmpty();
        assertThat(c.demandDate()).isEmpty();
    }

    @Test
    void 목록_3쪽에서_코드를_모아_상세를_읽고_같은_코드는_중복해서_읽는다() throws Exception {
        FakeFetcher fetcher = new FakeFetcher();
        List<BatchIpoCrawling> rows = new IpoStockScraper(fetcher, "http://fake.test/").scrap("2026", "T1");

        // 목록 3쪽 × 코드 2개 = 6건(AS-IS 그대로 중복 포함), 목록 URL 3 + 상세 6
        assertThat(rows).hasSize(6);
        assertThat(fetcher.urls).hasSize(9);
        assertThat(fetcher.urls.get(0)).isEqualTo("http://fake.test/sub03/ipo04.asp?str1=2026&str2=all&str3=&str4=&page=1");
        assertThat(fetcher.urls.get(3)).isEqualTo("http://fake.test/view_pg/view_04.asp?code=ZZ001");
        assertThat(rows).allSatisfy(r -> assertThat(r.trackId()).isEqualTo("T1"));
    }

    @Test
    void 스크래핑_결과를_sch13에_구분_2로_넣는다() {
        FakeFetcher fetcher = new FakeFetcher();
        ScrapingIpoAction action = new ScrapingIpoAction(ipoService, fetcher, true, "http://fake.test");

        assertThat(action.run(new BatchReq(null, null, null, null, null, null, null, null, null)))
                .isEqualTo("공모주청약 및 수요예측 일정 ScrapingIpo 작업 완료.. commit");

        // 연말이면 내년까지 두 해를 읽는다
        int years = ScrapingIpoAction.years(LocalDate.now()).size();
        assertThat(fetcher.urls.stream().filter(u -> u.contains("page=1")).count()).isEqualTo(years);
        Integer inserted = jdbc.queryForObject("select count(*) from sch13_ipo_crawling where sch13_stk_code in ('ZZ001','ZZ002') and sch13_target_type = '2'", Integer.class);
        assertThat(inserted).isEqualTo(6 * years);
        var a = jdbc.queryForMap("select * from sch13_ipo_crawling where sch13_stk_code = 'ZZ001' limit 1");
        assertThat(a.get("sch13_stk_name")).isEqualTo("시뮬공모A");
        assertThat(a.get("sch13_market_type")).isEqualTo("코스닥");
        assertThat(a.get("sch13_lead_manager")).isEqualTo("시뮬증권,가상투자증권");
    }

    @Test
    void 꺼져_있으면_접속하지_않고_거절한다() {
        FakeFetcher fetcher = new FakeFetcher();
        ScrapingIpoAction action = new ScrapingIpoAction(ipoService, fetcher, false, "http://fake.test");

        assertThatThrownBy(() -> action.run(new BatchReq(null, null, null, null, null, null, null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("꺼져 있습니다");
        assertThat(fetcher.urls).isEmpty();
    }

    @Test
    void 샘플이_없어_읽기가_실패하면_저장하지_않는다() {
        IpoPageFetcher broken = url -> { throw new IOException("connect timed out"); };
        ScrapingIpoAction action = new ScrapingIpoAction(ipoService, broken, true, "http://fake.test");
        int before = jdbc.queryForObject("select count(*) from sch13_ipo_crawling", Integer.class);

        assertThatThrownBy(() -> action.run(new BatchReq(null, null, null, null, null, null, null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("connect timed out");
        assertThat(jdbc.queryForObject("select count(*) from sch13_ipo_crawling", Integer.class)).isEqualTo(before);
    }

    @Test
    void 연말에는_내년도_함께_읽는다() {
        assertThat(ScrapingIpoAction.years(LocalDate.of(2026, 6, 1))).containsExactly("2026");
        assertThat(ScrapingIpoAction.years(LocalDate.of(2026, 11, 4))).containsExactly("2026", "2027");
    }
}
