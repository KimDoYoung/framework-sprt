package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys03_company_menu INSERT/UPDATE 파라미터 (useYn: 'true'/'false') */
public record CompanyMenuRow(Long companyMenuId, Long companyId, Long menuId, String useYn) {
}
