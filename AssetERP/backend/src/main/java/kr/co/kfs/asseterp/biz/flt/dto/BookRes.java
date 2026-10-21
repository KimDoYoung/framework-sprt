package kr.co.kfs.asseterp.biz.flt.dto;

/** 보유내역 한 행 (AS-IS Flt11_BookModel — flt11_book.selectByText2: 보유잔고 + 승인 전·후 사전신고 반영 / selectByText: 해당일 보유잔고) */
public record BookRes(
        Long bookId,
        String bookDate,
        String accountNo,
        String itemType,
        String itemTypeName,
        String itemName,
        String itemCode,
        Long bookAmt,
        Double bookQty,
        String bookDays,
        String buyDate,
        Boolean checkFundHoldYn,
        Boolean lockupCheckYn,
        String lockupDate,
        String familyRelateCode,
        Long accountId,
        String accountInfo) {
}
