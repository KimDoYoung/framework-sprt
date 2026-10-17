package kr.co.kfs.asseterp.biz.ics.dto;

/** 개정내역에 연결된 법규 한 행 (AS-IS Ics19_RevisionRelateIcsModel 중 ics19_Grid_IcsList 그리드 열, E03) */
public record IcsRevisionLawRes(Long revisionRelateIcsId, Long revisionHistoryId, Long classTreeId, String classTreeName) {
}
