package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 개별 중요표시 저장 — 새로 넣을 사원 (AS-IS Apr50_Bookmark.update) */
public record AprBookmarkSaveReq(List<Long> personIds) {
}
