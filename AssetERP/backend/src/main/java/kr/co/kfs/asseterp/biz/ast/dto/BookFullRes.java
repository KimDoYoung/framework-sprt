package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 예금원장 한 행의 전체 열(Ast09_Tab_DepositBookPeriod가 sys99_print에 쌓는 값) — Ast09_BookModel 중 selectByHoldDatePeriod가 쓰는 속성 */
public record BookFullRes(Long bookId, LocalDate holdDate, LocalDate firstPurDate, String astSClassCode, String astSClassName,
                          String keepCorpAccountName, String curCode, Double forBookAmt, Double holdQty, Long bookAmt,
                          Long keepAccountId, Long astClassTreeId, Long purAmt, Long acrIntAmt, Long evalAmt, Long evalPl,
                          Long oci, Long firstPurAmt, String keepAccountName, String astClassName, String astClassTreeName,
                          String accountTypeName, String lockUpPeriodName, LocalDate lockUpDate, Double lockUpQty) {
}
