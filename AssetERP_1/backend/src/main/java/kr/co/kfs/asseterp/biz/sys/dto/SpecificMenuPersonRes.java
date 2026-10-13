package kr.co.kfs.asseterp.biz.sys.dto;

/** A15-4 사원권한 행 (AS-IS Sys51_SpecificMenuPersonModel) */
public record SpecificMenuPersonRes(
        Long specificMenuPersonId,
        Long specificMenuId,
        Long personId,
        String personNm,
        String useYn,
        String note,
        String specificWorkCd
) {
}
