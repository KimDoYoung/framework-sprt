package kr.co.kfs.asseterp.biz.flt.dto;

/** 사전신고 화면 계좌 그리드 한 행 (AS-IS flt03_account.selectByDate) */
public record TrAccountRes(
        Long accountId,
        Boolean mainAccountYn,
        String mainAccountYnStr,
        String familyRelateCode,
        String familyRelateName,
        String corpName,
        String accountNoDec,
        String accountName,
        String itemTypeName) {
}
