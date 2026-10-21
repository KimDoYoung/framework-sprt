package kr.co.kfs.asseterp.biz.flt.dto;

/** 권리행사/기타입출고 한 행 (AS-IS Flt10_TrModel — flt10_tr.selectByTrType: 매매구분 FloorTrCode0002 그룹) */
public record RightsExerciseRes(
        Long trId,
        String trType,
        String trTypeName,
        String regDate,
        String trDate,
        Long accountId,
        String accountInfo,
        String trItemType,
        String trItemTypeName,
        String trItemName,
        String trItemCode,
        Double trQty,
        Long trAmt,
        String trNote) {
}
