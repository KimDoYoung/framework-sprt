package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** Ast12_Lookup_RealDeposit 그리드 한 행 — AS-IS ast12_book_real.selectByHoldDate (없는 계좌도 빈 값으로 나온다) */
public record BookRealRes(
        Long bookRealId,
        LocalDate holdDate,
        Long astClassTreeId,
        String itemSClassName,
        String corpName,
        String astClassTreeName,
        String curCode,
        Long realAmt,
        Double realForAmt,
        Long rcntAmt,
        Double rcntForAmt,
        String note
) {
}
