package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 회사별 메뉴 사용 저장 요청·응답 행 (AS-IS updateCompanyMenu). companyMenuId가 null이면 INSERT */
public record CompanyMenuUse(Long menuId, Long companyMenuId, boolean companyMenuYn) {
}
