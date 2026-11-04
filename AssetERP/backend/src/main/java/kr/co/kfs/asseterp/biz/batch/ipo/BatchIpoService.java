package kr.co.kfs.asseterp.biz.batch.ipo;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIpo;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawlRow;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchIpoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.function.BiFunction;

/**
 * 공모주 일정 배치 (AS-IS BatchMain.ipoScrap·ipo38Scrap·upsertSch10·ipoMismatch).
 * AS-IS는 "크롤링 저장 → commit → 후처리 → commit" 두 번에 나눠 commit한다 — 후처리가 실패해도 저장분은 남는다.
 * 그래서 각 단계를 별도 트랜잭션 메서드로 나누고, 호출하는 Action이 순서대로 부른다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchIpoService {

    private final BatchIpoMapper mapper;

    /** IPO Stock 119서버 전달 데이터(행은 \n, 열은 |, 18열)를 sch13에 넣는다 */
    @Transactional
    public void saveIpoStock(String data) {
        saveCrawling(data, BatchIpoCrawling::ofIpoStock);
    }

    /** 공모주38 119서버 전달 데이터(행은 \n, 열은 |, 33열)를 sch13에 넣는다 */
    @Transactional
    public void saveIpo38(String data) {
        saveCrawling(data, BatchIpoCrawling::ofIpo38);
    }

    private void saveCrawling(String data, BiFunction<String, String[], BatchIpoCrawling> factory) {
        if (data == null) {
            // AS-IS는 NullPointerException(메시지 없음)으로 롤백된다 — 입력 검사로 분명한 문구를 준다
            throw new BusinessException(ErrorCode.INVALID_INPUT, "data가 없습니다.");
        }
        String trackId = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String[] rows = data.split("\n");
        for (String row : rows) {
            String[] col = row.split("\\|");
            mapper.insertCrawling(factory.apply(trackId, col));
        }
        log.info("공모주 크롤링 {}건 저장 trackId={}", rows.length, trackId);
    }

    /** 공모주 일정 미일치내역 생성 (DB 함수 f_create_ipoMismatch) */
    @Transactional
    public String createMismatch() {
        return mapper.createIpoMismatch();
    }

    /**
     * 최신 공모주38 크롤링 내역으로 공모주 일정(sch10_ipo)을 등록·갱신하고, 홈페이지에서 사라진 종목은 미사용으로 바꾼다
     * (AS-IS BatchMain.upsertSch10). 미일치 점검이 끝난 건은 반영하지 않는다.
     */
    @Transactional
    public void upsertSch10() throws ParseException {
        List<BatchIpoCrawlRow> crawlList = mapper.selectLatestCrawling(BatchIpoCrawling.TARGET_IPO38);
        BatchIpoCrawlRow firstData = crawlList.get(0);   // 비어 있으면 AS-IS처럼 IndexOutOfBounds

        for (BatchIpoCrawlRow crawl : crawlList) {
            boolean insert = false;

            String marketType = IpoScheduleParser.convMarketType(crawl.marketType());
            String issCorpCode = mapper.selectValidItemCode(crawl.stkCode());
            issCorpCode = issCorpCode.substring(0, 5);
            log.debug("{} ---- issCorpCode={}, marketType={}", crawl.stkCode(), issCorpCode, marketType);

            BatchIpo existing = mapper.selectIpoByIssCorpCode(issCorpCode, marketType);

            BatchIpo.BatchIpoBuilder b;
            if (existing == null) {
                log.debug("{} 신규등록", crawl.stkName());
                insert = true;
                b = BatchIpo.builder().issCorpCode(issCorpCode).marketCode(marketType).companyId(0L).cancelYn("false");
            } else {
                if (existing.isMismatchChecked()) {
                    continue;   // 미일치내역 체크완료된건은 반영안함
                }
                b = existing.toBuilder();
            }

            b.itemName(crawl.stkName().trim());
            b.priceBracket(crawl.priceBracket());
            b.note(crawl.leadManager().replaceAll("\\.", ","));     // 주간사

            // 철회여부 예외처리 — 더본코리아: 종목코드(발행기관)가 다름(95107:X => 47556:O)
            if (!"951070".equals(crawl.stkCode())) {
                b.cancelYn("false");
            }

            // 아래 [0]은 값이 비어 있으면 AS-IS처럼 NullPointerException (원본-이상한점)
            LocalDate[] demandDate = IpoScheduleParser.extrDate(crawl.demandDate());
            b.demandStartDate(demandDate[0]).demandCloseDate(demandDate[1]);

            LocalDate[] subscriptionDate = IpoScheduleParser.extrDate(crawl.subscriptionDate());
            b.subscriptionStartDate(subscriptionDate[0]).subscriptionCloseDate(subscriptionDate[1]);

            b.divDate(IpoScheduleParser.extrDate(crawl.divDate())[0]);
            b.payDate(IpoScheduleParser.extrDate(crawl.payDate())[0]);
            b.refundDate(IpoScheduleParser.extrDate(crawl.refundDate())[0]);

            LocalDate[] listDate = IpoScheduleParser.extrDate(crawl.listDate());
            b.listDate(listDate != null ? listDate[0] : null);

            b.price(IpoScheduleParser.extrLong(crawl.finalPrice()));

            BatchIpo ipo = b.build();
            if (insert) {
                mapper.insertIpo(ipo);
            } else {
                mapper.updateIpo(ipo);
            }

            mapper.insertCorpName(crawl.leadManager());    // 신규주간사 등록
        }

        // 홈페이지에서 사라진 종목들은 '미사용여부=true'로 일괄 update
        // (AS-IS는 시장구분·발행기관코드도 계산해 넘기지만 SQL이 쓰지 않는다 — 계산 중 예외도 같게 하려고 그대로 부른다)
        IpoScheduleParser.convMarketType(firstData.marketType());
        firstData.stkCode().substring(0, 5);
        mapper.updateCancelYn(firstData.trackId());
    }
}
