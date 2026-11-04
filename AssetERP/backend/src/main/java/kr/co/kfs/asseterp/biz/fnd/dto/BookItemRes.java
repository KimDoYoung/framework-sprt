package kr.co.kfs.asseterp.biz.fnd.dto;

/** 종목별 보유펀드 조회창의 종목 행 (AS-IS fnd10_book.selectItemList, EE47) */
public record BookItemRes(Long bookId, String itemCode, String itemName) {
}
