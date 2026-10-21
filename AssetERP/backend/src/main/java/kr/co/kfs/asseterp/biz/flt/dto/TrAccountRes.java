package kr.co.kfs.asseterp.biz.flt.dto;

/** 사전신고·정기보고 화면 계좌 그리드 한 행 (AS-IS flt03_account.selectByDate). setupDate는 정기보고 실거래일 점검(계좌개설일)에 쓴다 */
public record TrAccountRes(
        Long accountId,
        Boolean mainAccountYn,
        String mainAccountYnStr,
        String familyRelateCode,
        String familyRelateName,
        String corpName,
        String accountNoDec,
        String accountName,
        String itemTypeName,
        String setupDate) {
}
