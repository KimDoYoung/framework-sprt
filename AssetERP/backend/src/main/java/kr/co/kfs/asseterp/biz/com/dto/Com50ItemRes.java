package kr.co.kfs.asseterp.biz.com.dto;

/** 종목정보 (Com50_Lookup_StkItem 그리드). itemType 2010=주식 */
public record Com50ItemRes(Long itemId, String itemCode, String itemName, String itemType) {
}
