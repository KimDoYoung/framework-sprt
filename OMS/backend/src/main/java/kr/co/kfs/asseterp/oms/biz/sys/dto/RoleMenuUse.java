package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 권한그룹별 메뉴 권한 저장 요청·응답 행 (AS-IS updateRoleMenu). roleMenuId가 null이면 INSERT */
public record RoleMenuUse(Long menuId, Long roleMenuId, boolean roleMenuYn) {
}
