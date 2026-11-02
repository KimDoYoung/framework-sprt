package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS Ast30_BookFundFeeModel — 펀드보수현황(Ast30_Tab_FundMngFee) 그리드 행: 전월 잔액·당월 발생액·당월 인출액·당월 잔액 */
public record BookFundFeeMonthRes(String fundCode, String fundName, Long preFee, Long occFee, Long drawFee, Long fee) {
}
