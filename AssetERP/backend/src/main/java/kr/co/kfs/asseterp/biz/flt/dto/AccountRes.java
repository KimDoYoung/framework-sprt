package kr.co.kfs.asseterp.biz.flt.dto;

/** AS-IS Flt03_AccountModel (flt03_account.selectByPersonId / selectById 열). 계좌번호는 복호화한 값만 내린다 */
public record AccountRes(
        Long accountId,
        Long companyId,
        Long personId,
        String setupDate,
        String regReason,
        String regReasonName,
        String familyRelateCode,
        String familyRelateName,
        Boolean mainAccountYn,
        String accountName,
        String accountNoDec,
        Long corpId,
        String corpName,
        String corpBranchName,
        String itemType,
        String itemTypeName,
        String note,
        Long apprId,
        String apprRegDate,
        String apprStatusCode,
        String apprStatusName,
        Long trCnt,
        Long bookCnt,
        Long bookInitCnt) {
}
