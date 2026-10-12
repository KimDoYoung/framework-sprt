package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS Sys07_RoleMenu 의 param Map: companyId = 목적지 회사, inCompanyId = 출발지 회사, roleName(정확한 이름), menuId */
public record RoleMenuCopyParam(Long companyId, Long inCompanyId, String roleName, Long menuId) {
    public RoleMenuCopyParam withMenuId(Long m) {
        return new RoleMenuCopyParam(companyId, inCompanyId, roleName, m);
    }
}
