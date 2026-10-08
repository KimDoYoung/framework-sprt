package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 권한그룹별 메뉴 맵핑 트리 행 (AS-IS Sys06_MenuModel + roleMenuModel ← sys06_menu.selectByRoleId).
 * 전위 순서 평평한 목록, depth로 들여쓰기. menuNoPlusNm = 메뉴번호 + ' ' + 메뉴명. useYn은 sys07_use_yn 그대로(null = 그 권한에 연결 행 없음)
 */
public record RoleMenuTreeRes(Long menuId, Long parentId, Integer depth, String menuNoPlusNm, String seq, String note,
                              Long roleMenuId, String useYn) {
    public RoleMenuTreeRes withDepth(int d) {
        return new RoleMenuTreeRes(menuId, parentId, d, menuNoPlusNm, seq, note, roleMenuId, useYn);
    }
}
