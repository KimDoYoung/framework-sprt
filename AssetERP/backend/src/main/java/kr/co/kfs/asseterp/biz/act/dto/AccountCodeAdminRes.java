package kr.co.kfs.asseterp.biz.act.dto;

/** 계정코드 관리 그리드 한 행 (AS-IS act01_account_code.selectByCompanyId). 여부 열은 DB 형태('true'/'false') 그대로 */
public record AccountCodeAdminRes(Long accountCodeId, Long companyId, String accountCode, String accountName,
                                  String accountName2, String accountEName, String parentCode, String parentName,
                                  String attributeCode, String attributeName, String drcrType, String drcrName,
                                  String slipYn, String printYn, String useYn, String fssYn, String fssAccountName,
                                  String fssSlipYn, String printSeq, String content) {
}
