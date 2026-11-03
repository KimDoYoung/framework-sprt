package kr.co.kfs.asseterp.biz.dcr.dto;

/** 보내는 회사 (AS-IS sys01_company.selectById / selectByPersonId) */
public record DcrMailCompanyRow(String locationName, String companyName, String mailInfo, String mailLogYn) {
}
