package kr.co.kfs.asseterp.biz.ast.dto;

/** 감가상각대장 구분별 합계 — 상신(A29) 본문 표의 한 줄 (ast13_book_depn.getDepnDate2) */
public record DepnBookGroupRes(Long bookDepnId, String itemType, Long purAmt, Long depnCost, Long acmDepnCost, Long remDepnCost) {
}
