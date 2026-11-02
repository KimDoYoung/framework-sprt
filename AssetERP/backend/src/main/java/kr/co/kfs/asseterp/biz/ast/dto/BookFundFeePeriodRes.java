package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast30_BookFundFeeModel — 일자·운용사별 합계(보수원장 기간조회 위 그리드) */
public record BookFundFeePeriodRes(LocalDate holdDate, Long corpId, String corpCode, String corpName,
                                   Long diffFee, Long fee, Long unRcvFee, Long tyFee, Long fixFee) {
}
