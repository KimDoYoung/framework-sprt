package kr.co.kfs.asseterp.biz.ast.dto;

/** 금융상품 보유내역 종목유형별 합계 — 상신(A30) 본문 표의 한 줄 (ast09_book.getHoldDate) */
public record FinanceGroupRes(Long bookId, String astClassName, Long purAmt, Long bookAmt, Long evalAmt, Long evalPl) {
}
