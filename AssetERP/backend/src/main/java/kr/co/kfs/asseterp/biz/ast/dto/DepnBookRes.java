package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 감가상각대장 한 줄 (ast13_book_depn.selectByDepnDate2) */
public record DepnBookRes(Long bookDepnId, String accountTypeName, String itemType, String itemName, String itemFullName, String note,
                          LocalDate purDate, Long purAmt, Long nonDeductTax, Long monthDepnCost, Long depnCost, Long acmDepnCost,
                          Long remDepnCost, LocalDate retireDate, Long purTrId) {
}
