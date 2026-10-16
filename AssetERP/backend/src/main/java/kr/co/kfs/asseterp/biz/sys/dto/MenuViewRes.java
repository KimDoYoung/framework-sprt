package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 메뉴별 그룹권한(View) 메뉴 트리 행 (AS-IS Sys06_Tab_MenuView ← sys.Sys06_Menu.selectByCompanyId).
 * 전위 순서 평평한 목록, depth는 루트 0. menuNoPlusNm = 메뉴번호 + ' ' + 메뉴명
 */
public record MenuViewRes(Long menuId, Long parentId, Integer depth, String menuNoPlusNm) {
    public MenuViewRes withDepth(int d) {
        return new MenuViewRes(menuId, parentId, d, menuNoPlusNm);
    }
}
