package kr.co.kfs.asseterp.biz.sys.dto;

/** 화면안내 저장 (AS-IS Sys55_MenuGuideCompany.upsertContent). menuGuideCompanyId가 없으면 새로 넣고 있으면 내용을 고친다 */
public record MenuGuideContentSaveReq(Long menuGuideCompanyId, Long menuId, String content) {
}
