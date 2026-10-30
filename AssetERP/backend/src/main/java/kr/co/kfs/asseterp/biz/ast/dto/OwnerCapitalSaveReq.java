package kr.co.kfs.asseterp.biz.ast.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 자기자본 저장 요청 한 행 — ownerCapitalId ≤ 0이면 신규 */
public record OwnerCapitalSaveReq(Long ownerCapitalId, LocalDate stdDate, BigDecimal amt, String note) {
}
