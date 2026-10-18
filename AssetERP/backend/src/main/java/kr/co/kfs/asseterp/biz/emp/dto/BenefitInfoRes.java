package kr.co.kfs.asseterp.biz.emp.dto;

/** 복리후생비 고객사별 설정 한 행 (AS-IS emp55_benefit_info.selectBySearchText). 미사용은 DB 형태('true'/'false') 그대로 */
public record BenefitInfoRes(Long benefitInfoId, Long companyId, String benefitCode, String benefitName,
                             String issueLinkCode, String expenseLinkCode, String accountCode, String accountName,
                             String unUseYn) {
}
