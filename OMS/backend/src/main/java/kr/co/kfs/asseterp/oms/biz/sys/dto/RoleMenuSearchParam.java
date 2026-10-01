package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 권한그룹별 메뉴 조회 조건 (AS-IS sys06_menu.selectByRoleId 파라미터 Map) */
public record RoleMenuSearchParam(Long companyId, Long roleId, Long parentId) {
}
