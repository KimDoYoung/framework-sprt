package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 시세관리(Ast25_Tab_Price, W10) 한 줄 — AS-IS ast25_price.selectByStdDatePaging. lockYn은 공용 시세(회사 0, icam20_price) */
public record PrcRes(Long priceId, Long companyId, LocalDate stdDate, String itemType, String itemTypeName, String itemCode, String itemName,
                     Double evalPrice, String note, String itemFullCode, Boolean lockYn) {
}
