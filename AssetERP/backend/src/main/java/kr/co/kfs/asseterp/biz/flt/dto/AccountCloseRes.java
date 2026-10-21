package kr.co.kfs.asseterp.biz.flt.dto;

/** AS-IS Flt06_AccountCloseModel (flt06_account_close.selectByPersonId 열) */
public record AccountCloseRes(
        Long accountCloseId,
        Long accountId,
        String closeDate,
        String familyRelateName,
        String accountName,
        String accountNoDec,
        String corpName,
        String corpBranchName,
        String itemTypeName,
        Long apprId,
        String apprRegDate,
        String apprStatusCode,
        String apprStatusName) {
}
