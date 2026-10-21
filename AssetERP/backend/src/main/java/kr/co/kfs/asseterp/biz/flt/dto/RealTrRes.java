package kr.co.kfs.asseterp.biz.flt.dto;

/**
 * 정기보고 매매내역 한 행 (AS-IS Flt10_TrModel — flt10_tr.selectByPeriod 열 중 정기보고 화면이 쓰는 것).
 * 사전신고 열(regDate~expectTrAmt·itemType…·trReason)은 [Copy] 셀이 실거래 열로 옮기는 값이다.
 */
public record RealTrRes(
        Long trId,
        Long accountId,
        String accountInfo,
        String accountNo,
        String accountRelateName,
        String accountRelateCode,
        String trType,
        String trTypeName,
        String statusName,
        String checkPeriod,
        String regDate,
        String itemType,
        String itemTypeName,
        String itemName,
        String itemCode,
        Double expectTrQty,
        Long expectTrAmt,
        String trReason,
        String trDate,
        String trItemType,
        String trItemTypeName,
        String trItemName,
        String trItemCode,
        Double trQty,
        Long trAmt,
        String trNote,
        Long befTrAmt,
        String stkPriceYn,
        String checkTargetYn,
        Long apprId,
        String apprRegDate,
        String apprStatusCode,
        String apprStatusName) {
}
