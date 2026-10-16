package kr.co.kfs.asseterp.biz.sys.dto;

/** sys05_user_role INSERT/UPDATE 파라미터. companyId는 로그인 회사 권한그룹인지 거는 데만 쓴다 */
public record UserRoleRow(
        Long userRoleId,
        Long companyId,
        Long userId,
        Long roleId,
        Long authOrgId
) {
}
