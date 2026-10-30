package kr.co.kfs.asseterp.biz.crd.dto;

/** biz.Biz01_Promo.targetCheck·targetListCheck의 세는 값 — dataCount 내역 수, confirmCount 내역확정(biz01_promo가 있는) 수, closeCount 그 중 마감 수 */
public record CrdPromoCountRow(int dataCount, int confirmCount, int closeCount) {
}
