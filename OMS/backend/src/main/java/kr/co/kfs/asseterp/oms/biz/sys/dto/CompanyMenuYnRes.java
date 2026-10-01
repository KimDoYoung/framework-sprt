package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 메뉴를 쓰는 고객사 (AS-IS sys01_company.selectByMenuId: 사용 고객사 전체 + 메뉴 보유 여부)
 *
 * @param menuYn        sys03 행이 있으면 true
 * @param companyMenuId sys03_company_menu_id
 */
public record CompanyMenuYnRes(Long companyId, String companyNm, String icamCompanyCd, boolean menuYn, Long companyMenuId) {
}
