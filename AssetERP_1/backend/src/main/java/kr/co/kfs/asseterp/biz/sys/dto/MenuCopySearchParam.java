package kr.co.kfs.asseterp.biz.sys.dto;

/** A09 일괄복사 매뉴 검색 (AS-IS retrieve01: searchText = '%' + 값 + '%', menuNameYn) */
public record MenuCopySearchParam(String searchText, String menuNameYn) {
}
