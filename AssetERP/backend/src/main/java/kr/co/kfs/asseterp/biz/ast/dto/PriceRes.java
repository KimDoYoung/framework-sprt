package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 고유자산 시세정보 — AS-IS ast25_price.selectHoldItem의 Ast25_PriceModel (시세입력 조회창) */
public record PriceRes(Long priceId, Long companyId, LocalDate stdDate, String itemType, String itemTypeName, String itemCode, String itemName, Double evalPrice) {
}
