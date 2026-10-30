package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 취소할 결제 한 건 (로그인 회사의 것만 읽는다) */
public record SettleDeleteRes(Long settleId, Long personId, String trCode, LocalDate settleDate) {
}
