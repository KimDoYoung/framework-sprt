package kr.co.kfs.asseterp.biz.flt.dto;

/** 권리행사/기타입출고 등록·변경 창이 저장하는 열 (trId 0 이하는 신규) */
public record RightsExerciseSaveReq(
        Long trId,
        String trType,
        String regDate,
        Long accountId,
        String trItemType,
        String trItemName,
        String trItemCode,
        Double trQty,
        Long trAmt,
        String trNote) {
}
