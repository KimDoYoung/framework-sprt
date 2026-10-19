package kr.co.kfs.asseterp.biz.sys.dto;

/** 북마크 (Sys40_BookmarkModel) */
public record BookmarkRes(Long bookmarkId, Long companyId, Long personId, Long menuId, String menuNm, String parentTitleNm, String seq) {
}
