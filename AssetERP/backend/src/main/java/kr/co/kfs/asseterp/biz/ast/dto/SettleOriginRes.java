package kr.co.kfs.asseterp.biz.ast.dto;

/** 결제변경 때 쓰는 결제내역의 원거래(거래 또는 지출결의서)와 등록자 — 로그인 회사의 결제만 */
public record SettleOriginRes(Long trId, Long expenseId, Long personId) {
}
