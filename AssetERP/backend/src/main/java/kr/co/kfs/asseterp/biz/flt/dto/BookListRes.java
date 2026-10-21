package kr.co.kfs.asseterp.biz.flt.dto;

/** 보유내역조회 한 행 (AS-IS Flt11_BookModel · flt11_book.selectByBookList, I09 Flt11_Tab_BookList) */
public record BookListRes(
        Long bookId,
        String accountNo,
        String itemTypeName,
        String itemName,
        Double bookQty,
        Long bookAmt,
        String bookDays,
        String buyDate,
        Long yearInvestLimit,
        Long totalInvestAmt,
        Double turnoverRate) {
}
