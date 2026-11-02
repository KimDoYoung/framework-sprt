package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 금감원보고용 재무제표 출력 준비 요청 — AS-IS sys.Sys99_Print.insertRdReportFSS (stdDate는 기준년월의 말일, code GA023/GA025) */
public record GenLedgerFssRdReq(String windowClassName, LocalDate stdDate, String code) {
}
