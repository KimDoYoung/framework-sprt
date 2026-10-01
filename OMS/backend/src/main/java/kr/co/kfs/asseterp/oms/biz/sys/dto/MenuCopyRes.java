package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 일괄복사 대상 메뉴 (AS-IS sys06_menu.getAllMenuList: 3차 이하 메뉴) */
public record MenuCopyRes(Long menuId, Long parentId, String menuNoPlusNm, String parentPathNm, String note) {
}
