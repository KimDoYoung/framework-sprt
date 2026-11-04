package kr.co.kfs.asseterp.biz.flt.dto;

import java.time.LocalDate;

/** 최초원장 한 줄 (AS-IS Flt13_BookInitModel — flt13_book_init.selectByPersonId): 잔고기준일·계좌·종목유형·종목명·종목코드·보유수량·보유금액 */
public record BookInitRes(Long bookInitId, LocalDate bookDate, Long accountId, String accountInfo, String itemType, String itemTypeName,
                          Boolean stkPriceYn, String itemName, String itemCode, Double bookQty, Long bookAmt) {
}
