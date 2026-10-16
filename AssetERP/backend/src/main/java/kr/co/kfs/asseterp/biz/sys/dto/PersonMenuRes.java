package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 사원별 메뉴 트리 행 (AS-IS Sys07_Tree_PersonRoleMenu ← sys.Sys06_Menu.selectByPersonId → TreeUtil.makeMenuTree).
 * 전위 순서 평평한 목록, parentId는 makeMenuTree가 레벨로 찾은 부모(없으면 null = 루트), depth는 루트 0. menuNoPlusNm = 메뉴번호 + ' ' + 메뉴명
 */
public record PersonMenuRes(Long menuId, Long parentId, Integer depth, String menuNoPlusNm) {
}
