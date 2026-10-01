package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 권한그룹 (AS-IS Sys04_RoleModel, sys04_role)
 *
 * @param defaultRole 회사 기본 권한그룹 여부 (sys04_default_role = 'true')
 * @param adminYn     관리자권한 여부 (sys04_admin_yn = 'true')
 */
public record RoleRes(
        Long roleId,
        String roleNm,
        String seq,
        String note,
        Long companyId,
        String companyNm,
        boolean defaultRole,
        boolean adminYn
) {
}
