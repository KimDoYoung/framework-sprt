package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여항목(pay20_item) 한 행 — 항목구분·과세구분 이름은 f_cdnm */
public record PayItemRes(Long itemId, String itemType, String itemCd, String itemName, String nonTaxType, Long seq,
                         String useYn, String note, String itemTypeName, String nonTaxTypeName) {
}
