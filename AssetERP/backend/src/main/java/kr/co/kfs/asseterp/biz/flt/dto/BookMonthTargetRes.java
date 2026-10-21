package kr.co.kfs.asseterp.biz.flt.dto;

/** 평가처리 대상 한 행 (AS-IS flt12_book_month.selectInsertBookAmtTarget) — bookMonthId는 이미 있으면 그 ID, 없으면 새 ID */
public record BookMonthTargetRes(
        Long bookMonthId,
        Long companyId,
        Long personId,
        Long accountId,
        String itemName,
        String itemType,
        String bookDate,
        Long bookAmt,
        String itemCode,
        String stkPriceYn) {
}
