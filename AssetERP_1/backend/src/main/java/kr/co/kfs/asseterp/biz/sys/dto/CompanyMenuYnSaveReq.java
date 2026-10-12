package kr.co.kfs.asseterp.biz.sys.dto;

/** A09 회사 그리드 저장 행 (AS-IS sys.Sys01_Company.updateByMenuYn: menuYn true → 연결 INSERT, false → 그 연결 DELETE) */
public record CompanyMenuYnSaveReq(Long companyId, Long companyMenuId, String menuYn) {
}
