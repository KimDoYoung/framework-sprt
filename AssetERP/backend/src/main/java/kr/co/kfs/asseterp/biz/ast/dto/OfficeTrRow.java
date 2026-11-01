package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** 비품대장 등록창 저장 한 줄 (ast.Ast06_Tr.updateDepn2) — trId가 0 이하면 새 줄, lockYn이면 적요만 바꾼다 */
public record OfficeTrRow(@NotNull Long trId, boolean lockYn, String trCode, Long astClassTreeId, String note, Long contAmt,
                          LocalDate date, Long tax, Long corpId, Long expenseId) {
}
