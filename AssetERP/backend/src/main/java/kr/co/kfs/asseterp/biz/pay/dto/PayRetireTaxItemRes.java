package kr.co.kfs.asseterp.biz.pay.dto;

/** 퇴직정산 소득세 항목(pay14_retire_tax_item) — itemType 1:총소득액 3:종합소득공제 4:세액공제 */
public record PayRetireTaxItemRes(Long retireTaxItemId, Long monthId, String itemType, String itemName, Long itemAmt, Long pyItemAmt) {
}
