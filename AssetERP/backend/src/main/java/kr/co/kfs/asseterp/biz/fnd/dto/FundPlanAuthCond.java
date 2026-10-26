package kr.co.kfs.asseterp.biz.fnd.dto;

/** 신규기획펀드 권한설정 조회 조건 (AS-IS selectByFundName / selectByFundOrgAuth 파라미터). planYn은 항상 'true' */
public record FundPlanAuthCond(Long companyId, String closeYn, String fundTypeCode, String classTypeCode, String fundName) {
}
