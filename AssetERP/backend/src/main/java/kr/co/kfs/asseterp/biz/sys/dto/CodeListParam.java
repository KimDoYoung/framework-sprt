package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS sys09_code.selectByCodeKindId (searchText는 코드+코드명에 포함 검색) */
public record CodeListParam(Long codeKindId, Long companyId, String searchText) {
}
