package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 사원의 메뉴 (AS-IS sys06_menu.selectUserMenu1Bang: 보유 권한그룹 + 회사 기본 권한그룹, 깊이 우선) */
public record PersonMenuRes(Long menuId, Long parentId, int level, String menuNoPlusNm, String classNm, String note) {
}
