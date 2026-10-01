package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 권한그룹별 메뉴 트리 행 (AS-IS sys06_menu.selectByRoleId, 깊이 우선 순서로 펼친 목록)
 *
 * @param level      1차 메뉴 = 0
 * @param roleMenuYn 권한 (sys07_use_yn = 'true')
 * @param roleMenuId sys07_role_menu_id (행이 없으면 null)
 */
public record RoleMenuRes(
        Long menuId,
        Long parentId,
        int level,
        String menuNoPlusNm,
        String seq,
        String note,
        Long roleMenuId,
        boolean roleMenuYn
) {
    public RoleMenuRes withLevel(int level) {
        return new RoleMenuRes(menuId, parentId, level, menuNoPlusNm, seq, note, roleMenuId, roleMenuYn);
    }
}
