package kr.co.kfs.asseterp.biz.apr.dto;

/** A65 비품관리대장 본문의 구분별 취득금액 (AS-IS ast13_book_depn.selectOfficeAssetsGroup, Ast13_BookDepnModel itemType·purAmt, V27) */
public record BookDepnGroupRow(String itemType, Long purAmt) {
}
