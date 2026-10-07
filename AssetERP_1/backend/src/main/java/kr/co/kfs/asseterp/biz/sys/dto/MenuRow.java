package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * sys06_menu 조회 행
 *
 * @param parentMenuNm 상위 메뉴 이름 (3차 메뉴 조회 시 2차 메뉴 이름)
 * @param parentSeq    상위 메뉴 순번 (3차 메뉴 조회 시 2차 메뉴 정렬용)
 */
public record MenuRow(
        Long menuId,
        String menuNm,
        String menuNo,
        String seq,
        Long parentId,
        String classNm,
        String parentMenuNm,
        String parentSeq
) {
}
