package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast30_BookFundFeeModel — 펀드보수원장 현황(Ast30_Tab_FundMngFeeState) 그리드 행. corpId는 그리드에 없고 증감액 상세 창에 쓴다 */
public record BookFundFeeStateRes(LocalDate holdDate, Long corpId, String fundCode, String fundName,
                                  Long preFee, Long diffFee, Long fee, Long monthOccFee, Long occFee, Long drawFee, Long unRcvFee) {
}
