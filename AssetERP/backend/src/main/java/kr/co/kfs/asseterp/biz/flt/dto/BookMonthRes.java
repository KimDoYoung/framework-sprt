package kr.co.kfs.asseterp.biz.flt.dto;

/** 월말 평가금액 한 행 (AS-IS Flt12_BookMonthModel — flt12_book_month.selectByBookDate). bookMonthId가 없는 월말 보유는 행번호가 대신 들어온다 */
public record BookMonthRes(
        Long bookMonthId,
        Long accountId,
        String accountNo,
        String bookDate,
        String itemType,
        String itemTypeName,
        String itemName,
        String itemCode,
        Double bookQty,
        Long bookAmt,
        Boolean stkPriceYn) {
}
