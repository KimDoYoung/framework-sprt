package kr.co.kfs.asseterp.biz.flt.dto;

/** 계좌대체 한 행 (AS-IS Flt10_TrModel — flt10_tr.selectByTrType: 매매구분 30N, 출고계좌 → 입고계좌) */
public record AcntTransferRes(
        Long trId,
        String trType,
        String regDate,
        String trDate,
        String trItemType,
        String trItemTypeName,
        String trItemName,
        String trItemCode,
        Double trQty,
        Long trAmt,
        Long outAccountId,
        String outAccountInfo,
        Long accountId,
        String accountInfo) {
}
