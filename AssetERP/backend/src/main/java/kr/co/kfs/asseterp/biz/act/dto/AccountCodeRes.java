package kr.co.kfs.asseterp.biz.act.dto;

/** 계정코드 한 행 (AS-IS act01_account_code.selectBySlipYn). 계정명 앞의 "(사용X)"는 SQL이 붙인다 */
public record AccountCodeRes(Long accountCodeId, Long companyId, String attributeCode, String attributeName,
                             String accountCode, String accountName, String accountName2) {
}
