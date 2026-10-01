package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 고객사 검색 조건 (AS-IS sys01_company.selectByName / selectByCopyList)
 *
 * @param searchText LIKE 패턴
 * @param useYn      'true'면 사용 고객사만, 'false'·null이면 전체 (selectByName)
 */
public record SysCompanySearchParam(String searchText, String useYn) {
}
