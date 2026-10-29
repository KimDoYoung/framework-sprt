package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 예금잔고 기간조회 한 행(Ast09_Tab_DepositBookPeriod) — 전일 대비 증감액 포함 */
public record BookPeriodRes(Long bookId, LocalDate holdDate, String astSClassName, String keepCorpAccountName, String curCode,
                            Double forBookAmt, Double forDiffAmt, Long bookAmt, Double diffAmt, Long keepAccountId, Long astClassTreeId) {
}
