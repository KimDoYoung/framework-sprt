package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 통합 문서검색 목록 한 줄 (AS-IS Dcr00_Tab_DocList 그리드). statusName은 굵은 글씨 HTML, bookmarkYn은 'true'/'false' */
public record AprDocSearchRes(Long apprId, String bookmarkYn, LocalDateTime regDate, String regEmpName, String statusName, String title,
                              String inOutTypeName, String classTreeName, String receiveName, String stampSeq, String relateDisplayName,
                              String note) {
}
