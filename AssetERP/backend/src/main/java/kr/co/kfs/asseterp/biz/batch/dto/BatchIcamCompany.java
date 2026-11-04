package kr.co.kfs.asseterp.biz.batch.dto;

/** ICAM 연계 대상 회사 (AS-IS sys01_company.selectIcamCompanyCode — ICAM 회사코드가 있고 사용 중, 상품 S3·A1) */
public record BatchIcamCompany(Long companyId, String icamCompanyCode) {
}
