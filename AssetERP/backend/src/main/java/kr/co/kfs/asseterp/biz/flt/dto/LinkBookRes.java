package kr.co.kfs.asseterp.biz.flt.dto;

/** AS-IS flt11_book.selectByDate — A09 자기매매 실거래 보고서 본문의 보유내역 줄(Flt11_BookModel) */
public record LinkBookRes(String accountNo, String accountRelateName, String itemName, Double bookQty, Long bookAmt,
                          String itemTypeName) {
}
