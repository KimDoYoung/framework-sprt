package kr.co.kfs.asseterp.biz.sys.dto;

/** 회사 화면안내 한 건 (AS-IS Sys55_MenuGuideCompanyModel, sys55_menu_guide_company.getMenuDetailModel) */
public record MenuGuideContentRes(Long menuGuideCompanyId, Long companyId, Long menuId, String content, String note, String menuNoPlusNm) {
}
