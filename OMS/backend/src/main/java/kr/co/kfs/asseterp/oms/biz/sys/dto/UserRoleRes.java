package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 권한그룹별 사원 (AS-IS Sys05_UserRoleModel + 사원·발령·조직)
 *
 * @param authOrgId 권한조직 (sys05_auth_org_id)
 * @param orgNm     사원의 현재 조직
 */
public record UserRoleRes(
        Long userRoleId,
        Long userId,
        Long roleId,
        String seq,
        String note,
        Long authOrgId,
        String authOrgNm,
        String empNo,
        String empKorNm,
        String orgNm,
        String titleNm
) {
}
