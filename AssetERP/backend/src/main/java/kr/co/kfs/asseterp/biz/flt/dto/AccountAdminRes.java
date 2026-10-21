package kr.co.kfs.asseterp.biz.flt.dto;

/** 계좌신고현황 한 행 (J01 Flt03_Tab_AccountAdmin, flt03_account.selectByDate) — 날짜는 YYYY-MM-DD, 계좌번호는 복호화한 값 */
public record AccountAdminRes(
        Long accountId,
        String orgName,
        String personName,
        String corpName,
        String accountNoDec,
        String accountName,
        String familyRelateName,
        String itemTypeName,
        String setupDate,
        Long apprId,
        String apprStatusName,
        String closeDate,
        Long closeApprId,
        String closeApprStatusName) {
}
