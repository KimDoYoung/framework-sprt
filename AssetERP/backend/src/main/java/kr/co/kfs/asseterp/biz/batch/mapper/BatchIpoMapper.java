package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIpo;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawlRow;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIpoCrawling;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 공모주 일정 배치 SQL (AS-IS: sch13_ipo_crawling.insert·selectByTrackId·selectValidItemCode,
 * sch10_ipo.selectByIssCorpCode·insert·update·updateCancelYn, sch12_ipo_corp.insertCorpName, sch14_ipo_mismatch.createIpoMismatch)
 */
@Mapper
public interface BatchIpoMapper {

    int insertCrawling(@Param("p") BatchIpoCrawling row);

    /** 구분(1:공모주38 / 2:IPO-Stock)의 가장 최근 크롤링 중 상장일이 오늘 이후(또는 없음)인 것, 최신순 */
    List<BatchIpoCrawlRow> selectLatestCrawling(@Param("targetType") String targetType);

    String selectValidItemCode(@Param("itemCode") String itemCode);

    /** 발행기관코드+시장구분의 일정 1건(수요예측 시작일 최신), 없으면 null */
    BatchIpo selectIpoByIssCorpCode(@Param("issCorpCode") String issCorpCode, @Param("marketType") String marketType);

    int insertIpo(@Param("p") BatchIpo ipo);

    int updateIpo(@Param("p") BatchIpo ipo);

    int insertCorpName(@Param("leadManager") String leadManager);

    int updateCancelYn(@Param("trackId") String trackId);

    String createIpoMismatch();
}
