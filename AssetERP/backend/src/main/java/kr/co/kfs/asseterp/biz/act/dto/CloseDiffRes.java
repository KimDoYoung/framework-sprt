package kr.co.kfs.asseterp.biz.act.dto;

/** 마감검증 SQL 한 행. 검증 항목마다 쓰는 열이 달라 나머지는 null이다(AS-IS는 Act04_GenLedgerModel·Ast09_BookModel·Ast30_BookFundFeeModel을 번갈아 썼다). */
public record CloseDiffRes(String accountCode, String accountName, String astClassTreeName,
                           Long drTodayBalAmt, Long crTodayBalAmt, Long drTodayDiffAmt,
                           String checkCode, String note,
                           String corpName, String corpCode, String fundCode, String fundName,
                           Double icamFee, Double forFee, Long diffFee) {
}
