package kr.co.kfs.asseterp.biz.sys.dto;

/** A09 일괄복사 고객사 목록 (AS-IS sys01_company.selectByCopyList) */
public record CompanyCopyRes(Long companyId, String companyNm, String erpProductCd, String assetYn, String advisYn,
                             String icamCompanyCd) {
}
