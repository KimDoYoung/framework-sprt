package kr.co.kfs.asseterp.biz.flt.dto;

/** 월말 평가금액 저장 한 행 — 평가금액(bookAmt)만 바뀌고 나머지는 행의 식별 값(AS-IS GridUpdate → flt12_book_month 동적 INSERT/UPDATE) */
public record BookMonthSaveReq(
        Long bookMonthId,
        Long accountId,
        String bookDate,
        String itemType,
        String itemName,
        String itemCode,
        Long bookAmt,
        Boolean stkPriceYn) {
}
