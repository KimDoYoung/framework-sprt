package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 반영 대상 운용사 (AS-IS sys01_company.selectByUseYn) */
public record DcrCopyCompanyRes(Long companyId, String companyName, String locationName, String icsGuideYn) {
}
