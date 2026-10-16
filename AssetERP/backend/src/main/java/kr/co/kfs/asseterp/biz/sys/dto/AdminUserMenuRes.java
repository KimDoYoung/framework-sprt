package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 관리자별 메뉴 권한 트리 행 (AS-IS Sys06_MenuModel + adminUserMenuModel ← sys06_menu.selectByAdminUserId).
 * 트리는 전위 순서의 평평한 목록으로 내보내고 depth·parentId로 화면이 트리를 그린다. useYn은 DB 값 그대로(null = 설정 없음)
 */
public record AdminUserMenuRes(Long menuId, Long parentId, Integer depth, String menuNm, String seq, String note,
                               Long adminUserMenuId, String useYn) {
    public AdminUserMenuRes withDepth(int d) {
        return new AdminUserMenuRes(menuId, parentId, d, menuNm, seq, note, adminUserMenuId, useYn);
    }
}
