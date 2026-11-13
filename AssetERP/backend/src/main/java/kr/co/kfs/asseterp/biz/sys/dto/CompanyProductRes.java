package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS sys01_company.selectByErpProductCode (원본 2026-11-13, CH-0404) — 상품(ERP 상품코드)·고객명·서브도메인 */
public record CompanyProductRes(Long companyId, String companyNm, String locNm, String erpProductCd) {
}
