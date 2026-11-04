package kr.co.kfs.asseterp.biz.batch.action;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.ipo.BatchIpoService;
import kr.co.kfs.asseterp.biz.batch.ipo.IpoPageFetcher;
import kr.co.kfs.asseterp.biz.batch.ipo.IpoStockScraper;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * AS-IS BatchMain.scrapingIpo (L582) — 이 서버가 IPOStock 홈페이지를 직접 읽어 공모주 일정을 sch13에 넣는다.
 * 올해와 2개월 뒤 해(연말이면 내년)를 읽고, 결과는 모두 읽은 뒤 한 트랜잭션으로 저장한다(중간 실패 시 저장 없음, AS-IS 롤백과 같다).
 * 외부 HTTP는 운영에서만 열리므로 {@code asseterp.ipo-scrap.enabled=true}일 때만 접속한다(기본 꺼짐).
 * AS-IS와 달리 미일치내역 생성은 부르지 않는다(ipoScrap과 다름 — 원본 그대로).
 */
@Slf4j
@Component
public class ScrapingIpoAction implements BatchAction {

    private final BatchIpoService ipoService;
    private final IpoPageFetcher fetcher;
    private final boolean enabled;
    private final String baseUrl;

    public ScrapingIpoAction(BatchIpoService ipoService, IpoPageFetcher fetcher,
                             @Value("${asseterp.ipo-scrap.enabled:false}") boolean enabled,
                             @Value("${asseterp.ipo-scrap.base-url:http://www.ipostock.co.kr}") String baseUrl) {
        this.ipoService = ipoService;
        this.fetcher = fetcher;
        this.enabled = enabled;
        this.baseUrl = baseUrl;
    }

    @Override
    public String actionCode() {
        return "scrapingIpo";
    }

    @Override
    public String run(BatchReq req) {
        if (!enabled) {
            throw new BusinessException(ErrorCode.INVALID_INPUT,
                    "IPOStock 직접 스크래핑이 꺼져 있습니다(asseterp.ipo-scrap.enabled=false). 운영 서버에서만 켭니다.");
        }
        log.info("공모주청약 및 수요예측 일정 Scraping 시작 (scrapingIpo)");

        List<String> years = years(LocalDate.now());
        String trackId = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        try {
            IpoStockScraper scraper = new IpoStockScraper(fetcher, baseUrl);
            List<BatchIpoCrawling> all = new ArrayList<>();
            for (String year : years) {
                all.addAll(scraper.scrap(year, trackId));
            }
            ipoService.saveScraped(all);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, e.getMessage());
        }
        return "공모주청약 및 수요예측 일정 ScrapingIpo 작업 완료.. commit";
    }

    /** 올해, 그리고 2개월 뒤가 다른 해면 그 해도 */
    public static List<String> years(LocalDate today) {
        List<String> years = new ArrayList<>();
        String year1 = String.valueOf(today.getYear());
        String year2 = String.valueOf(today.plusMonths(2).getYear());
        years.add(year1);
        if (!year1.equals(year2)) {
            years.add(year2);
        }
        return years;
    }
}
