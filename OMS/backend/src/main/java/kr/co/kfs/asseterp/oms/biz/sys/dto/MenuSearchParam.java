package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 메뉴 조회 조건 (AS-IS Sys06_Menu.selectByHeaderMenu* / selectByTailMenu* 의 파라미터 Map)
 *
 * @param companyId 로그인 회사 (sys03_company_menu.sys03_company_id)
 * @param userId    사원 emp01_person_id (sys05_user_role.sys05_user_id). 회사관리자 메뉴 조회에는 쓰지 않는다
 * @param parentId  상위 메뉴 ID. 1차 메뉴는 0
 */
public record MenuSearchParam(Long companyId, Long userId, Long parentId) {
}
