package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여 항목 한 행(Pay11_TabPage_MonthItem 지급·공제 그리드 — 항목명 · 과세구분 · 금액) */
public record PayMonthItemRes(Long monthItemId, Long monthId, String itemType, String itemCd, Long itemAmt,
                              String itemTypeNm, String nonTaxTypeNm, String itemNm) {
}
