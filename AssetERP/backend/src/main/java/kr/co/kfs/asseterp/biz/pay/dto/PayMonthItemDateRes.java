package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여항목조회 그리드 한 행 — pay11_month_item.selectByDate (S19) */
public record PayMonthItemDateRes(Long monthItemId, LocalDate payDate, String payName, String personNo, String personName,
                                  String posName, String itemTypeName, String itemName, Long itemAmt) {
}
