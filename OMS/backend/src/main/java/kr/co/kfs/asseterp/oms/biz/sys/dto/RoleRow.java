package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * sys04_role INSERT/UPDATE 파라미터. companyId는 로그인 회사(서버에서 넣는다)
 */
public record RoleRow(Long roleId, Long companyId, String roleNm, String seq, String note) {

    public static RoleRow of(Long roleId, Long companyId, RoleSaveReq req) {
        return new RoleRow(roleId, companyId, req.roleNm().trim(), req.seq(), req.note());
    }
}
