package kr.co.kfs.asseterp.biz.flt.dto;

/** 계좌대체 저장 한 행 — trId 0 이하면 신규(AS-IS UpdateDataModel). 실거래일(trDate)은 대체일(regDate)과 같고 회사·사원은 로그인 사용자 */
public record AcntTransferSaveReq(
        Long trId,
        String regDate,
        String trItemType,
        String trItemName,
        String trItemCode,
        Double trQty,
        Long trAmt,
        Long outAccountId,
        Long accountId) {
}
