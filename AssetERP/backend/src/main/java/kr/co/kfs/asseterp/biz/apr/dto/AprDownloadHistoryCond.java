package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr40_download_history.selectByTextPaging 조건 (F09 다운로드 기록). searchText는 LIKE 패턴 */
public record AprDownloadHistoryCond(Long companyId, LocalDate startDate, LocalDate closeDate, String searchText, long limit, long offset) {
}
