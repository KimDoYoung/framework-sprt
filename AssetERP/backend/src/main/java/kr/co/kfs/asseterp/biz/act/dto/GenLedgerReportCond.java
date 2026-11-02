package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** selectBSPL 조건 — checkStdCnt·checkCompareCnt는 결산원장(act05) 존재 여부(0이면 가결산원장 사용) */
public record GenLedgerReportCond(Long companyId, LocalDate stdDate, LocalDate compareDate,
                                  Long checkStdCnt, Long checkCompareCnt, Boolean exceptZeroYn, String reportType) {
}
