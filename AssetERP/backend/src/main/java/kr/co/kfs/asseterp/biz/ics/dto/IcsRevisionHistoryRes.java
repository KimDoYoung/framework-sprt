package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDateTime;

/** Ics20_RevisionHistoryModel 중 Ics20_Lookup_RevisionHistory 그리드 열 + 상세내용(note) */
public record IcsRevisionHistoryRes(Long revisionHistoryId, LocalDateTime regDate, LocalDateTime submissionDate, LocalDateTime effectDate, String title,
                                    String financeAgencyName, LocalDateTime reflectionDate, Long fileCount, String note) {
}
