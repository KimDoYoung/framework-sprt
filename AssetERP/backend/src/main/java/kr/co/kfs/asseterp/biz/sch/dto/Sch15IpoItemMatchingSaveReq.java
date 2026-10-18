package kr.co.kfs.asseterp.biz.sch.dto;

/** IPO 종목코드 매칭 저장 (Sch15_Lookup_IpoItemMatching.update). ipoItemMatchingId가 없거나 0 이하면 새 행 */
public record Sch15IpoItemMatchingSaveReq(Long ipoItemMatchingId, String itemCode, String validItemCode, String itemName) {
}
