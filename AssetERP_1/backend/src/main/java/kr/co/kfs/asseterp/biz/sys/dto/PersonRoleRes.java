package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 사원별 권한그룹 (A04 Sys05_Tab_PersonRole, AS-IS sys04_role.selectByUserId → Sys04_RoleModel).
 * userRoleYn은 원본처럼 'true'/'false' 문자열, userRoleId는 연결이 있을 때만(삭제 키).
 */
public record PersonRoleRes(
        Long roleId,
        String roleNm,
        String seq,
        String note,
        String userRoleYn,
        Long userRoleId
) {
}
