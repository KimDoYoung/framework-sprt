package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 회계마감 월 목록 한 행 (Act04_GenLedgerModel: 마감월·마감일·마감여부) */
public record GenLedgerCloseStatusRes(Long genLedgerId, LocalDate stdDate, String monthName, String closeName) {
}
