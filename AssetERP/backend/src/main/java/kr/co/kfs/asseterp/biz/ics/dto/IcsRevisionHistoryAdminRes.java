package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDateTime;

/** 법규 개정내역 한 행 (AS-IS Ics20_RevisionHistoryModel 중 Ics20_Tab_RevisionHistoryAdmin 그리드 열 + 편집 폼 값, E03) */
public record IcsRevisionHistoryAdminRes(Long revisionHistoryId, LocalDateTime regDate, LocalDateTime submissionDate, LocalDateTime effectDate,
                                         LocalDateTime reflectionDate, String financeAgencyCode, String financeAgencyName, String title,
                                         String relatedLaw, String note, Long icsCount, Long fileCount) {
}
