package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** AS-IS ast.Ast06_Tr.checkDepn(companyId, trDate, purTrId) — 상각 대상(종목 대분류 50·55)만 검사하고 그 밖은 통과 */
public record TrDepnCheckReq(@NotNull LocalDate date, Long purTrId, String itemLClassCode) {
}
