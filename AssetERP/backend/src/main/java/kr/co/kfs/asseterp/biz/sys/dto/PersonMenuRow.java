package kr.co.kfs.asseterp.biz.sys.dto;

/** 사원 메뉴 조회 행 (AS-IS Sys06_MenuModel ← sys06_menu.selectUserMenu1Bang). menuLevel = 재귀 CTE의 depth(1부터), 순서는 SQL의 path 순 */
public record PersonMenuRow(Long menuId, Integer menuLevel, String menuNoPlusNm) {
}
