package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 메뉴 관리 트리 행 (AS-IS sys06_menu.selectByParentId, 깊이 우선 순서로 펼친 목록)
 *
 * @param level      1차 메뉴 = 0
 * @param useYn      사용 (sys06_use_yn = 'true', 값이 없으면 사용)
 * @param menuFullNm 상위 경로를 포함한 메뉴 이름 (f_menu_nm_allpath)
 */
public record MenuItemRes(
        Long menuId,
        Long parentId,
        int level,
        String menuNm,
        String classNm,
        String seq,
        boolean useYn,
        String menuNo,
        String note,
        String menuFullNm
) {
    public MenuItemRes withLevel(int level) {
        return new MenuItemRes(menuId, parentId, level, menuNm, classNm, seq, useYn, menuNo, note, menuFullNm);
    }
}
