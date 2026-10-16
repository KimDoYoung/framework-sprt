package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * A09 오른쪽 회사 그리드 (AS-IS Sys01_Grid_CompanyMenu, sys01_company.selectByCode / selectByMenuId).
 * 같은 회사·메뉴 연결이 둘이면 원본처럼 두 행 — 화면 행 ID는 companyId + companyMenuId
 */
public record CompanyMenuYnRes(Long companyId, String companyNm, String menuYn, String erpProductCd, String assetYn,
                               String advisYn, String icamCompanyCd, Long companyMenuId) {
}
