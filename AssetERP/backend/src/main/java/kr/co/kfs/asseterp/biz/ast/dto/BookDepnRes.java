package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast.Ast13_BookDepn.selectByDepnDate — 기준일의 비품·상각 자산 보유내역(Ast13_Lookup_BookDepn) */
public record BookDepnRes(
        Long purTrId,
        Long astClassTreeId,
        String itemType,
        String itemName,
        String itemFullName,
        LocalDate purDate,
        Long purAmt,
        LocalDate depnDate,
        Long depnCost
) {
}
