package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 자산별 분개 이력 한 줄 (act02_journal.selectByAstClassTreeId, Act02_Grid_History) — 차변 금액은 +, 대변은 − */
public record JournalHistoryRes(Long journalId, LocalDate date, String astClassTreeName, String trName, Long journalAmt, String note) {
}
