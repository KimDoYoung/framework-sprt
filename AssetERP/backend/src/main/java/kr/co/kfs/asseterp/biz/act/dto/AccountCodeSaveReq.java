package kr.co.kfs.asseterp.biz.act.dto;

/** 계정코드 편집창 저장 (AS-IS act.Act01_AccountCode.modelUpdate) — accountCodeId가 없거나 0 이하면 새 계정 */
public record AccountCodeSaveReq(Long accountCodeId, String accountCode, String accountName, String accountName2,
                                 String accountEName, String parentCode, String attributeCode, String drcrType,
                                 String slipYn, String printYn, String useYn, String fssYn, String fssAccountName,
                                 String fssSlipYn, String printSeq, String content) {
}
