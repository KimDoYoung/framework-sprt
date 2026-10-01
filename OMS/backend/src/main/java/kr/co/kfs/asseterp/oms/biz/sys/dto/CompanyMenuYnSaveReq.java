package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 메뉴별 고객사 변경 행 (AS-IS Sys01_Company.updateByMenuYn): true면 sys03 INSERT, false면 companyMenuId DELETE */
public record CompanyMenuYnSaveReq(Long companyId, boolean menuYn, Long companyMenuId) {
}
