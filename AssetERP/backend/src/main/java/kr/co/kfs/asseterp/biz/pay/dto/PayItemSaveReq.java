package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여항목 저장 한 행 — itemId가 0 이하이거나 DB에 없으면 등록 */
public record PayItemSaveReq(Long itemId, String itemType, String itemCd, String itemName, String nonTaxType, Long seq, String useYn) {
}
