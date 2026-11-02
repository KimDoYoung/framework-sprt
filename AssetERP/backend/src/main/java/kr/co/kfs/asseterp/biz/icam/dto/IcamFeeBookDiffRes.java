package kr.co.kfs.asseterp.biz.icam.dto;

/** AS-IS ast30_book_fund_fee.selectFeeBookDiff 한 행 (Ast30_BookFundFeeModel의 대사용 속성만) */
public record IcamFeeBookDiffRes(String corpCode, String corpName, String fundCode, String fundName, Double icamFee, Double forFee, Long diffFee) {
}
