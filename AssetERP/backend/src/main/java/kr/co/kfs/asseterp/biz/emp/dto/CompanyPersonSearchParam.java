package kr.co.kfs.asseterp.biz.emp.dto;

/** selectByCompanyIdPaging/Total 파라미터 — companyId는 '%'(전체) 또는 회사 ID 문자열, searchText는 LIKE 패턴, useYn은 'true'/'false' */
public record CompanyPersonSearchParam(String companyId, String searchText, String useYn, int offset, int limit) {
}
