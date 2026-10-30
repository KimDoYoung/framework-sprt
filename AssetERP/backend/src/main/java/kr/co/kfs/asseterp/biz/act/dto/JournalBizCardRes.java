package kr.co.kfs.asseterp.biz.act.dto;

/** biz01_promo.selectBizCard — 전표를 만들거나 지울 법인카드 내역 (cardType 1 = 신용카드) */
public record JournalBizCardRes(Long promoId, String cardType, Long provideAmt) {
}
