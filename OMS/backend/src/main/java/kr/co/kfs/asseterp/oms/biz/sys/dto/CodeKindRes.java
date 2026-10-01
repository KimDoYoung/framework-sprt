package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 공통코드 종류 (AS-IS Sys08_CodeKindModel, sys08_code_kind)
 *
 * @param sysYn 시스템 코드(회사 0의 코드를 모든 회사가 같이 쓴다) 여부 (sys08_sys_yn = 'true')
 */
public record CodeKindRes(Long codeKindId, String kindCd, String kindNm, boolean sysYn, String note) {
}
