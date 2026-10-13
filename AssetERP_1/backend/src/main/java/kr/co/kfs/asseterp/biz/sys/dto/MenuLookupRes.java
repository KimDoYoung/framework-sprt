package kr.co.kfs.asseterp.biz.sys.dto;

/** 매뉴찾기 조회창 행 (AS-IS Sys06_Lookup_SelectMulti — sys06_menu.getAllMenuList의 경로·매뉴명·전체 경로) */
public record MenuLookupRes(Long menuId, String parentPathNm, String menuNm, String menuFullNm) {
}
