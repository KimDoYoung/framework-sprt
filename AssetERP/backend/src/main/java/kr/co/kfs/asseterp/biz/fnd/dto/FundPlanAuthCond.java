package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드 권한설정 조회 조건 (AS-IS selectByFundName / selectByFundOrgAuth 파라미터). planYn은 P02 신규기획펀드 'true', P06 펀드 'false' */
public record FundPlanAuthCond(Long companyId, String closeYn, String fundTypeCode, String classTypeCode, String fundName, String planYn) {
}
