package kr.co.kfs.asseterp.biz.batch.dto;

/** 배치 대상 회사 (AS-IS sys01_company.selectByUseYn — 사용 중이고 ID가 0이 아닌 회사) */
public record BatchCompany(Long companyId, String companyName) {
}
