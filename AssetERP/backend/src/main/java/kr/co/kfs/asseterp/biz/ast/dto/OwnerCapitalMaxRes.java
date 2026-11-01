package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 기준일에 적용되는 최근 자기자본(ast40_owner_capital.selectByMaxDate) */
public record OwnerCapitalMaxRes(LocalDate stdDate, Long amt) {
}
