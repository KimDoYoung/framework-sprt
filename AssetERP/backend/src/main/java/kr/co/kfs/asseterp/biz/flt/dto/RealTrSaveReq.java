package kr.co.kfs.asseterp.biz.flt.dto;

/** 정기보고 매매내역 저장 한 행 — trId 0 이하면 신규(AS-IS UpdateDataModel). 회사·사원은 로그인 사용자 */
public record RealTrSaveReq(
        Long trId,
        String trType,
        Long accountId,
        String trDate,
        String trItemType,
        String trItemName,
        String trItemCode,
        Double trQty,
        Long trAmt,
        String trNote) {
}
