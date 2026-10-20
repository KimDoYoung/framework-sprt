package kr.co.kfs.asseterp.biz.ics.dto;

/** ics03_company_info 한 행 (AS-IS ics03_company_info.selectByClassTreeId) — 저장할 때 기존 값을 읽는 데 쓴다 */
public record IcsCompanyInfoRes(Long companyInfoId, String exceptYn, String autoYn, String advisYn) {
}
