package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast30_BookFundFeeModel — 한 운용사의 펀드별 보수원장(보수원장 현황 오른쪽 그리드). 외화 열은 KRW면 null */
public record BookFundFeeFundRes(Long bookFundFeeId, Long corpId, LocalDate holdDate, String fundCode, String fundName, String curCode,
                                 Long diffFee, Long fee, Long unRcvFee, Long tyFee, Long fixFee,
                                 Double forDiffFee, Double forFee, Double forUnRcvFee,
                                 LocalDate calcStartDate, LocalDate calcCloseDate) {
}
