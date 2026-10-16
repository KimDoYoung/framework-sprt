package kr.co.kfs.asseterp.biz.sys.dto;

/** 화면안내 저장 행 — 화면이 바꾸는 컬럼(화면안내)만 */
public record MenuGuideSaveReq(Long menuId, String note) {
}
