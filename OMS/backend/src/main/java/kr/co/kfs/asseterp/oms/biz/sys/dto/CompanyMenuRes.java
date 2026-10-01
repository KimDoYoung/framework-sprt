package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 회사별 메뉴 트리 행 (AS-IS sys06_menu.selectByCompanyIdAll, 깊이 우선 순서)
 *
 * @param companyMenuYn 회사 사용 (sys03_use_yn = 'true')
 * @param companyMenuId sys03_company_menu_id (행이 없으면 null)
 */
public record CompanyMenuRes(
        Long menuId,
        Long parentId,
        int level,
        String menuNm,
        String seq,
        String note,
        Long companyMenuId,
        boolean companyMenuYn
) {
    public CompanyMenuRes withLevel(int level) {
        return new CompanyMenuRes(menuId, parentId, level, menuNm, seq, note, companyMenuId, companyMenuYn);
    }
}
