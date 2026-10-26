package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드별 자산 한 행 (P09, AS-IS Fnd10_BookModel 중 Fnd10_Tab_RelateAst 그리드 열 — "종목명" 열은 원본이 note(비고)를 쓴다) */
public record BookRelateAstRes(Long bookId, String itemCode, String note, Long evalAmt) {
}
