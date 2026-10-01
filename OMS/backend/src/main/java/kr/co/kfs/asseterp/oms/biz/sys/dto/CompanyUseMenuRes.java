package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 회사가 사용하는 메뉴 트리 행 (AS-IS sys06_menu.selectByCompanyId, 깊이 우선 순서)
 *
 * @param level        1차 메뉴 = 0
 * @param menuNoPlusNm 화면번호 + 메뉴명 (AS-IS sys06_menu_no_plus_nm)
 */
public record CompanyUseMenuRes(
        Long menuId,
        Long parentId,
        int level,
        String menuNoPlusNm
) {
    public CompanyUseMenuRes withLevel(int level) {
        return new CompanyUseMenuRes(menuId, parentId, level, menuNoPlusNm);
    }
}
