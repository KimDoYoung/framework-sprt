package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * A09 메뉴 관리 트리 행 (AS-IS Sys06_MenuModel, sys06_menu.selectByParentId). 전위 순서 평평한 목록, depth는 서비스가 채운다.
 * Y/N 값은 DB 형태('true'/'false' 문자열) 그대로
 */
public record MenuTreeRes(Long menuId, Long parentId, Integer depth, String menuNm, String seq, String note, String useYn,
                          String classNm, String menualUrl, String addTitleUseYn, String mobiUseYn, String mobiClassNm,
                          String menuNo) {

    public MenuTreeRes withDepth(int d) {
        return new MenuTreeRes(menuId, parentId, d, menuNm, seq, note, useYn, classNm, menualUrl, addTitleUseYn, mobiUseYn,
                mobiClassNm, menuNo);
    }
}
