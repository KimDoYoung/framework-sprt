package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys06_menu INSERT/UPDATE 파라미터 (useYn: 'true'/'false') */
public record MenuItemRow(Long menuId, Long parentId, String menuNm, String classNm, String menuNo, String seq, String useYn, String note) {

    public static MenuItemRow of(Long menuId, MenuItemSaveReq req) {
        return new MenuItemRow(menuId, req.parentId(), req.menuNm().trim(), blankToNull(req.classNm()),
                blankToNull(req.menuNo()), req.seq(), String.valueOf(req.useYn()), req.note());
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
