package kr.co.kfs.asseterp.biz.crd.dto;

/** biz01_promo.selectByApprovalNo — 정상 건의 이익제공 내역 (승인취소 반영용) */
public record CrdPromoAmtRow(Long promoId, Long provideAmt, Long tax) {
}
