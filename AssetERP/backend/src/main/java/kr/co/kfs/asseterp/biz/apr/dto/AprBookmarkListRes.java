package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 중요표시 문서 한 줄 (AS-IS apr50_bookmark.selectByPersonIdPaging — Apr50_Lookup_ApprList 그리드). 열은 화면이 쓰는 것만 */
public record AprBookmarkListRes(Long bookmarkId, Long apprId, String statusName, LocalDateTime regDate, String inOutTypeName,
                                 String title, String regEmpName, LocalDateTime effectDate, String classTreeName) {
}
