package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 화면안내 행 (AS-IS sys06_menu.selectByMenuId: 3차 메뉴)
 *
 * @param menuFullNm 1차 > 2차 메뉴 이름 (AS-IS sys06_menu_full_nm)
 * @param menuNm     화면명
 * @param note       화면안내 (sys06_note)
 */
public record MenuGuideRes(Long menuId, String menuFullNm, String menuNm, String note) {
}
