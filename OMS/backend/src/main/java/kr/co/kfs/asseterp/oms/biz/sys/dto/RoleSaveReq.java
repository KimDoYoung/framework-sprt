package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 권한그룹 저장 행. roleId가 없거나 0 이하(프론트 임시 ID)면 신규
 */
public record RoleSaveReq(Long roleId, String roleNm, String seq, String note) {

    public boolean isNew() {
        return roleId == null || roleId <= 0;
    }
}
