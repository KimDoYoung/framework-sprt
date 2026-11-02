package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 계정원장 정리 요청 (act.Act04_GenLedger.summaryGenLedger) — 화면은 기준일자의 월 1일 ~ 기준일자를 보낸다 */
public record GenLedgerSummaryReq(LocalDate startDate, LocalDate closeDate) {
}
