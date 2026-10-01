package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 권한그룹별 사원 저장 행. userRoleId가 없거나 0 이하면 신규 */
public record UserRoleSaveReq(Long userRoleId, Long userId, Long roleId, Long authOrgId) {

    public boolean isNew() {
        return userRoleId == null || userRoleId <= 0;
    }
}
