package kr.co.kfs.asseterp.biz.ast.dto;

/** 통화별 합계 한 행(Act02_Tab_DepositIoList sumGrid) */
public record BookSumRes(Long bookId, String curCode, Double preDayAmt, Double holdQty) {
}
