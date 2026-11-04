package kr.co.kfs.asseterp.biz.fnd.dto;

/** 종목별 보유펀드 조회창의 펀드 행 (AS-IS fnd10_book.selectFundListByItemCode, EE47) */
public record BookFundRes(Long bookId, String fundCode, String fundName, String manageType) {
}
