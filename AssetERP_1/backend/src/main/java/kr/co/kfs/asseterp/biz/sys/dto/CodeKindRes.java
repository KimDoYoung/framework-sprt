package kr.co.kfs.asseterp.biz.sys.dto;

/** 코드구분 한 행 (AS-IS Sys08_CodeKindModel — sysYnFlag는 sysYn "true"). 그리드 순서: 코드구분·코드구분명·시스템·상세설명 */
public record CodeKindRes(Long codeKindId, String kindCd, String kindNm, String sysYn, String note) {
}
