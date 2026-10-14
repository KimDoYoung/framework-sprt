package kr.co.kfs.asseterp.biz.sys.dto;

/** A04 저장 행 (AS-IS updateUserRole이 읽는 Sys04_RoleModel 값: userRoleYn·roleId·roleName·userRoleModel) */
public record PersonRoleSaveReq(Long roleId, String roleNm, String userRoleYn, Long userRoleId) {
}
