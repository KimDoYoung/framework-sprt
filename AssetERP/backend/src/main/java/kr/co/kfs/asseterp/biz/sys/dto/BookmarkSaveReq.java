package kr.co.kfs.asseterp.biz.sys.dto;

/** 북마크 그룹명·그룹내 순서 저장 (북마크 창에서 고치는 열) */
public record BookmarkSaveReq(Long bookmarkId, String parentTitleNm, String seq) {
}
