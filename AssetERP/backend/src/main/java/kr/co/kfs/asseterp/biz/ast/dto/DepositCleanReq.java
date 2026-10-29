package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** 예금잔고정리 (AS-IS ast.Ast09_Book.createDepositBook) — 기준일부터 오늘까지 정리 */
public record DepositCleanReq(@NotNull LocalDate stdDate) {
}
