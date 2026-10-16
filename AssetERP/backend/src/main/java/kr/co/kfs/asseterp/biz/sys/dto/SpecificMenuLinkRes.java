package kr.co.kfs.asseterp.biz.sys.dto;

/** A15-4 문서권한(Link) 행 (AS-IS Sys52_SpecificMenuLinkModel) */
public record SpecificMenuLinkRes(
        Long specificMenuLinkId,
        Long companyId,
        String specificWorkCd,
        String linkCd,
        String linkNm,
        String note
) {
}
