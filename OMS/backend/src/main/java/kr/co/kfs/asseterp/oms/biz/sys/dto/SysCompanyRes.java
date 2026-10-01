package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 고객사 (AS-IS Sys01_CompanyModel 중 목록에 쓰는 컬럼) */
public record SysCompanyRes(Long companyId, String companyNm, String locNm, boolean useYn, String icamCompanyCd, String note) {
}
