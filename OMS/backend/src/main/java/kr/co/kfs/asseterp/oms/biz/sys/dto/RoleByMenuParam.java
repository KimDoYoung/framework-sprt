package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 메뉴별 권한그룹 조회 조건 (AS-IS sys04_role.selectByMenuId 파라미터 Map) */
public record RoleByMenuParam(Long companyId, Long menuId) {
}
