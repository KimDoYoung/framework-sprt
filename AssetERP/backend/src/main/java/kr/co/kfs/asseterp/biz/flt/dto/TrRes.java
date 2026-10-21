package kr.co.kfs.asseterp.biz.flt.dto;

/** 임직원 매매 사전신고 한 행 (AS-IS Flt10_TrModel — flt10_tr.selectByAccountId 열 중 매수·매도 사전신고 화면이 쓰는 것) */
public record TrRes(
        Long trId,
        Long companyId,
        Long personId,
        String trType,
        String trTypeName,
        Long accountId,
        String accountInfo,
        String accountRelateCode,
        String regDate,
        String itemType,
        String itemTypeName,
        String itemName,
        String itemCode,
        Double expectTrQty,
        Long expectTrAmt,
        String expectTrDate,
        String checkBuyLockup,
        String checkFundHold,
        String trReason,
        String statusCode,
        String statusName,
        String rejectReason,
        String trDate,
        Boolean unfillYn,
        Boolean stkPriceYn,
        Boolean checkTargetYn,
        Double bookQty,
        Long bookAmt,
        String bookDays) {
}
