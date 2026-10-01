package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 메뉴 등록·수정·이동 (AS-IS Sys06_Edit_Menu, Sys06_Select_Menu) */
public record MenuItemSaveReq(Long parentId, String menuNm, String classNm, String menuNo, String seq, boolean useYn, String note) {
}
