package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 기준 적용일 목록 한 행(Ast41_Lookup_InvestLimit 왼쪽 그리드) — investLimitId는 row_number */
public record InvestLimitDateRes(Long investLimitId, LocalDate startDate) {
}
