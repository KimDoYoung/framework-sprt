package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 공통코드 조회 조건 (AS-IS sys09_code.selectByCodeKindId). 시스템 코드종류면 SQL이 회사 0으로 바꾼다
 *
 * @param searchText 코드+코드명 부분 문자열 (SQL이 %를 붙인다)
 */
public record CodeSearchParam(Long codeKindId, Long companyId, String searchText, Long codeId) {
}
