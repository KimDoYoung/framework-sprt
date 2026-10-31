package kr.co.kfs.asseterp.biz.apr.dto;

/** 중요표시 한 줄 (AS-IS Apr50_BookmarkModel — personId가 없는 줄은 "전체 중요표시" 스위치 줄이다) */
public record AprBookmarkRes(Long bookmarkId, Long personId, String personInfo, String publicYn) {
}
