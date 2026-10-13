package kr.co.kfs.asseterp.biz.sys.dto;

/** A15-4 특정매뉴 권한 목록 행 (AS-IS Sys50_SpecificMenuModel — 특정업무·매뉴(전체 경로)·비고) */
public record SpecificMenuRes(
        Long specificMenuId,
        Long companyId,
        String specificWorkCd,
        String specificWorkNm,
        Long menuId,
        String menuNm,
        String note
) {
}
