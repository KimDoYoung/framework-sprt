package kr.co.kfs.asseterp.biz.ast.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 자기자본 한 행(Ast40_Tab_OwnerCapital) — ast40_owner_capital */
public record OwnerCapitalRes(Long ownerCapitalId, LocalDate stdDate, BigDecimal amt, String note) {
}
