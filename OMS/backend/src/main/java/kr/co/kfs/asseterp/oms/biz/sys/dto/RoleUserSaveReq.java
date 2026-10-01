package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 사원별 권한그룹 변경 행 (AS-IS updateUserRole): userRoleYn=true면 부여, false면 userRoleId 삭제 */
public record RoleUserSaveReq(Long roleId, String roleNm, boolean userRoleYn, Long userRoleId) {
}
