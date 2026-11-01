package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 보유자산 조회창(W06 Ast09_Lookup_Book) 행 — ast09_book.selectByHoldDate(astType 2 금융자산) 중 그리드·선택 결과가 쓰는 열 (AS-IS Ast09_BookModel) */
public record HoldBookRes(
        Long astClassTreeId,
        String astClassTreeName,
        String astClassName,
        Long corpId,
        String corpName,
        Long keepAccountId,
        String keepAccountName,
        Double holdQty,
        Long purAmt,
        Long bookAmt,
        Long acrIntAmt,
        LocalDate lockUpDate,
        Double sellPossibleQty,
        Long astTrUnit,
        String curCode,
        /** W07 외화 거래 편집창의 "외화 장부금액" */
        Double forBookAmt
) {
}
