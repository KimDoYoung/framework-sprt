package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여관리(항목별) Pay10_Tab_MonthItem 그리드 한 행 — AS-IS pay11_month_item.selectByText */
public record PayMonthItemTextRes(Long monthItemId, Long monthId, Long personId, String itemType, String itemCd, Long itemAmt,
                                  String itemTypeName, String nonTaxTypeName, String itemName,
                                  String personNo, String personName, String posName) {
}
