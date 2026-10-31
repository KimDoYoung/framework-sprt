package kr.co.kfs.asseterp.biz.pay.dto;

/** 지급·공제 항목 한 줄 (AS-IS Pay10_MonthModel의 itemName·itemAmt, pay10_month.selectByRetirePayCode, V18) */
public record PayItemAmtRow(String itemName, Long itemAmt) {
}
