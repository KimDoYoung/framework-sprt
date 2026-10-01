package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 코드종류 검색 조건 (AS-IS sys08_code_kind.selectByKindName)
 *
 * @param kindNm LIKE 패턴 (코드구분명 또는 구분코드)
 * @param sysYn  'true' / 'false' / '%'(전체) — LIKE 패턴
 */
public record CodeKindSearchParam(String kindNm, String sysYn) {
}
