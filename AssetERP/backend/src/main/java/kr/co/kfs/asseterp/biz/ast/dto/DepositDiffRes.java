package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** Ast09_Tab_DepositBook 그리드 한 행 — AS-IS ast09_book.selectByHoldDate(astType 1, depositDiffYn true). 상신 본문(A39)도 같은 열을 쓴다 */
public record DepositDiffRes(
        Long bookId,
        LocalDate holdDate,
        String astSClassName,
        String keepCorpAccountName,
        String corpName,
        String accountNo,
        String curCode,
        Double preDayAmt,
        Double forBookAmt,
        Double holdQty,
        Long bookAmt,
        Long fxPl,
        Double realAmt,
        Double diffAmt,
        Double fxRate
) {
}
