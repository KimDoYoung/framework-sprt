package kr.co.kfs.asseterp.biz.sys.dto;

/** 화면안내 한 행 (AS-IS Sys06_MenuModel 중 화면안내 그리드 열). menuFullName = 1차 > 2차 > 3차 메뉴 경로 */
public record MenuGuideRes(Long menuId, String menuFullName, String menuName, String note) {
}
