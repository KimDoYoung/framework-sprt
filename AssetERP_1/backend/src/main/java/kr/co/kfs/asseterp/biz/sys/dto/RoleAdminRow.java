package kr.co.kfs.asseterp.biz.sys.dto;

/** sys04_role INSERT/UPDATE 파라미터 (A02: 회사는 화면에서 고른 고객사) */
public record RoleAdminRow(
        Long roleId,
        Long companyId,
        String roleNm,
        String seq,
        String note,
        String defaultRole,
        String adminYn
) {
}
