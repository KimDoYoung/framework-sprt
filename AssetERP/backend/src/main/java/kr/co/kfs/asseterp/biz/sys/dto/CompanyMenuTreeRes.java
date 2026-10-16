package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 회사별 메뉴맵핑 트리 행 (AS-IS Sys06_MenuModel + companyMenuModel ← sys06_menu.selectByCompanyIdAll).
 * 전위 순서 평평한 목록, depth로 들여쓰기. useYn은 sys03_use_yn 그대로(null = 그 회사에 연결 행 없음)
 */
public record CompanyMenuTreeRes(Long menuId, Long parentId, Integer depth, String menuNm, String seq, String note,
                                 Long companyMenuId, String useYn) {
    public CompanyMenuTreeRes withDepth(int d) {
        return new CompanyMenuTreeRes(menuId, parentId, d, menuNm, seq, note, companyMenuId, useYn);
    }
}
