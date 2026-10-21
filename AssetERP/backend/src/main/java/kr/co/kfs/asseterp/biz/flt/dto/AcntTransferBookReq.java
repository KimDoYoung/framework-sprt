package kr.co.kfs.asseterp.biz.flt.dto;

/** 계좌대체 뒤 원장반영 대상 — 종목 한정(AS-IS createBook). 대체일부터 다시 만든다 */
public record AcntTransferBookReq(
        String trItemType,
        String trItemName,
        String trItemCode,
        String regDate) {
}
