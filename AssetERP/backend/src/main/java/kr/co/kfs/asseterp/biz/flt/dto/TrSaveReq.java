package kr.co.kfs.asseterp.biz.flt.dto;

/** 사전신고 저장 한 행 — trId 0 이하면 신규(AS-IS UpdateDataModel). 회사·사원은 로그인 사용자 */
public record TrSaveReq(
        Long trId,
        String trType,
        Long accountId,
        String regDate,
        String expectTrDate,
        String itemType,
        String itemName,
        String itemCode,
        Double expectTrQty,
        Long expectTrAmt,
        String trReason) {
}
