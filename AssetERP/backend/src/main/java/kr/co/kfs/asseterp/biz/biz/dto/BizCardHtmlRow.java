package kr.co.kfs.asseterp.biz.biz.dto;

/** A13 본문 "1) 카드별 사용내역" 한 줄 (AS-IS biz01_promo.getHtmlData — 카드명 (사원) · 제공금액 합) */
public record BizCardHtmlRow(String cardName, Long cardPrice) {
}
