package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 재무제표 출력 준비 요청 — AS-IS sys.Sys99_Print.insertRdReportPL (reportType 1 재무상태표 / 2 손익계산서) */
public record GenLedgerReportRdReq(String windowClassName, LocalDate stdDate, LocalDate compareDate,
                                   Boolean exceptZeroYn, String reportType) {
}
