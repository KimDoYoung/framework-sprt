package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys04_role INSERT/UPDATE 파라미터 (고객사 권한그룹 관리: 기본권한·관리자권한 포함, 'true'/'false' 문자열) */
public record CompanyRoleRow(Long roleId, Long companyId, String roleNm, String seq, String note, String defaultRole, String adminYn) {

    public static CompanyRoleRow of(Long roleId, Long companyId, CompanyRoleSaveReq req) {
        return new CompanyRoleRow(roleId, companyId, req.roleNm().trim(), req.seq(), req.note(),
                String.valueOf(req.defaultRole()), String.valueOf(req.adminYn()));
    }
}
