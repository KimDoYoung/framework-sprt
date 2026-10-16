package kr.co.kfs.asseterp.biz.sms.dto;

/** AS-IS Sms02_HistoryModel — selectByTotalCount (고객별 누적 사용건수) */
public record HistoryTotalRes(Long historyId, Long companyId, String companyNm, String locNm, Long totalCount, Long runningTotalCount) {
}
