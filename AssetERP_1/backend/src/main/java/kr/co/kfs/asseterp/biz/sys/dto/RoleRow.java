package kr.co.kfs.asseterp.biz.sys.dto;

/** sys04_role INSERT/UPDATE 파라미터 (회사는 로그인 회사) */
public record RoleRow(
        Long roleId,
        Long companyId,
        String roleNm,
        String seq,
        String note
) {
}
