package kr.co.kfs.asseterp.biz.sys.dto;

/** A09 일괄복사 매뉴 목록 (AS-IS sys06_menu.getAllMenuList → 경로·매뉴명) */
public record MenuCopyRes(Long menuId, String parentPathNm, String menuNoPlusNm) {
}
