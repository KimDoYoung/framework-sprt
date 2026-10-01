package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 사원별 권한그룹 (AS-IS sys04_role.selectByUserId: 회사 권한그룹 전체 + 사원 보유 여부)
 *
 * @param userRoleYn 사원이 이 권한그룹을 가졌는지
 * @param userRoleId 가졌으면 sys05_user_role_id
 */
public record RoleUserRes(Long roleId, String roleNm, String seq, String note, boolean userRoleYn, Long userRoleId) {
}
