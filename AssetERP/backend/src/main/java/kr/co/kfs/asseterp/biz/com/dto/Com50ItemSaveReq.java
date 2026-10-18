package kr.co.kfs.asseterp.biz.com.dto;

/** 종목정보 저장 (Com50_Lookup_StkItem.update). itemId가 없거나 0 이하면 새 행 */
public record Com50ItemSaveReq(Long itemId, String itemCode, String itemName, String itemType) {
}
