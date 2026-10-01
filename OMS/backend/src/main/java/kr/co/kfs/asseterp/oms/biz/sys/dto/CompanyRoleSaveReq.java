package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 고객사 권한그룹 저장 행 (AS-IS Sys04_Tab_RoleAdmin: 기본권한·관리자권한도 편집). roleId가 없거나 0 이하면 신규
 */
public record CompanyRoleSaveReq(Long roleId, String roleNm, String seq, String note, boolean defaultRole, boolean adminYn) {

    public boolean isNew() {
        return roleId == null || roleId <= 0;
    }
}
