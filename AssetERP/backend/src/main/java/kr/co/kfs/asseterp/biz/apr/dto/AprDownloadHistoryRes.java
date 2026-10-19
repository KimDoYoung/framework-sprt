package kr.co.kfs.asseterp.biz.apr.dto;

/** 다운로드 기록 한 줄 (AS-IS Apr40_Lookup_DownloadHistory 그리드). apprId는 보기 아이콘이 열 상신문서 */
public record AprDownloadHistoryRes(Long downloadHistoryId, Long apprId, String regDateString, String title, String personName) {
}
