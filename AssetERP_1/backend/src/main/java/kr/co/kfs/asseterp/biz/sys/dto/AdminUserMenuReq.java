package kr.co.kfs.asseterp.biz.sys.dto;

/** 관리자별 메뉴 권한 저장 행 (adminUserMenuId가 없으면 신규) */
public record AdminUserMenuReq(Long menuId, Long adminUserMenuId, String useYn) {
}
