package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 계정원장 SQL 파라미터. diffType 1 월별 · 2 일별 · 3 분기별, searchText는 LIKE 패턴, accountCode는 LIKE 패턴 */
public record GenLedgerCond(Long companyId, LocalDate stdDate, String diffType, String searchText, String accountCode) {
}
