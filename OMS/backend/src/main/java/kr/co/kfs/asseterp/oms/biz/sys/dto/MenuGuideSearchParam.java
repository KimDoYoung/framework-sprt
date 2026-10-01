package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 화면안내 조회 조건 (AS-IS sys06_menu.selectByMenuId 파라미터 Map)
 *
 * @param menuId     1차 메뉴 (null이면 전체)
 * @param searchText 메뉴/화면명 LIKE 패턴 (%검색어%)
 */
public record MenuGuideSearchParam(Long menuId, String searchText) {

    public static MenuGuideSearchParam of(Long menuId, String searchText) {
        return new MenuGuideSearchParam(menuId, "%" + (searchText == null ? "" : searchText.trim()) + "%");
    }
}
