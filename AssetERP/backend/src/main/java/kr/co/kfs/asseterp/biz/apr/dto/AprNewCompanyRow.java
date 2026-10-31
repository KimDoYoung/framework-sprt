package kr.co.kfs.asseterp.biz.apr.dto;

/** 새 문서가 쓰는 회사 정보 (sys01_company, V06) */
public record AprNewCompanyRow(String companyName, String companyRepName, String apprStepLockYn) {
}
