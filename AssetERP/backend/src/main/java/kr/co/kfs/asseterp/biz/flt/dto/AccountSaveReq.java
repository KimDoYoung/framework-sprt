package kr.co.kfs.asseterp.biz.flt.dto;

/** 저장 행 (AS-IS UpdateDataModel flt03_account). accountId 0 이하는 신규 */
public record AccountSaveReq(
        Long accountId,
        String setupDate,
        String regReason,
        String familyRelateCode,
        Boolean mainAccountYn,
        String accountName,
        String accountNoDec,
        Long corpId,
        String corpBranchName,
        String itemType,
        String note) {
}
