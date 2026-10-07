package kr.co.kfs.asseterp.biz.sys.dto;

/** sys03_company_menu / sys07_role_menu 복사용 파라미터 */
public record CompanyMenuParam(Long id, Long companyId, Long menuId, String roleName, Long roleId, String useYn) {
    public static CompanyMenuParam menu(Long companyId, Long menuId) {
        return new CompanyMenuParam(null, companyId, menuId, null, null, null);
    }

    public static CompanyMenuParam role(Long companyId, String roleName, Long menuId) {
        return new CompanyMenuParam(null, companyId, menuId, roleName, null, null);
    }
}
