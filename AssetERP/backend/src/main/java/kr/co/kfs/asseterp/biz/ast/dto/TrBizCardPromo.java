package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 법인카드 사용내역(biz01_promo + crd02_data)의 승인정보 — AS-IS Ast06_Lookup_TrBizCard.open(promoModel)이 받던 값 */
public record TrBizCardPromo(String approvalNo, LocalDate approvalDt, Long approvalAmount, Long tax) {
}
