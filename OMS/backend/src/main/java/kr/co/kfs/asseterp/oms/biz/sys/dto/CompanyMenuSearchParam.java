package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 회사 메뉴 조회·확인 조건 (AS-IS selectByCompanyIdAll, sys01_company.getInfoByMenuId, sys03_company_menu.countUseYn) */
public record CompanyMenuSearchParam(Long companyId, Long parentId, Long menuId) {
}
