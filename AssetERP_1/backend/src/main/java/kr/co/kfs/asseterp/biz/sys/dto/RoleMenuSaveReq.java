package kr.co.kfs.asseterp.biz.sys.dto;

/** 권한그룹별 메뉴 맵핑 저장 행 (roleMenuId가 없으면 신규) */
public record RoleMenuSaveReq(Long menuId, Long roleMenuId, String useYn) {
}
