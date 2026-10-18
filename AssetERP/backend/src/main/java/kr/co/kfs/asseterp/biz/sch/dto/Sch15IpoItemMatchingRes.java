package kr.co.kfs.asseterp.biz.sch.dto;

/** IPO 종목코드 매칭 (Sch15_Lookup_IpoItemMatching 그리드) */
public record Sch15IpoItemMatchingRes(Long ipoItemMatchingId, String itemCode, String validItemCode, String itemName) {
}
