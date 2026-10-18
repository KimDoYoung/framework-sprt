package kr.co.kfs.asseterp.biz.emp.dto;

/** 복리후생비 설정 저장 한 행 — benefitInfoId가 없거나 0 이하면 새 행 */
public record BenefitInfoSaveReq(Long benefitInfoId, String benefitCode, String issueLinkCode, String expenseLinkCode,
                                 String accountCode, String unUseYn) {
}
