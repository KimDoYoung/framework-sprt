package kr.co.kfs.asseterp.biz.flt.dto;

/** AS-IS flt13_book_init.getInfo — B05 계좌개설 신고서 본문의 계좌·보유종목 줄(Flt13_BookInitModel) */
public record LinkBookInitRes(String accountRelateName, String accountName, String accountBankName, String accountNo,
                              String accountNote, String itemName, Double bookQty) {
}
