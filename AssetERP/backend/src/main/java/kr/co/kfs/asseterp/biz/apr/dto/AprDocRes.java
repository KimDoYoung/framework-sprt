package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 업무별 문서작성 문서 목록 한 줄 (AS-IS Apr01_Grid_DocList 그리드). relateDisplayName은 "N건", statusName은 굵은 글씨 HTML, statusCode '30'이 완료 */
public record AprDocRes(Long apprId, String bookmarkYn, String title, String relateDisplayName, String statusName, String statusCode,
                        LocalDateTime regDate, LocalDateTime effectDate, String regEmpName) {
}
