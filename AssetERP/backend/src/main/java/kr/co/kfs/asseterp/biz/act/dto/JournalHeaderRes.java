package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** act02_journal 한 건 (전표 머리) */
public record JournalHeaderRes(
        Long journalId,
        LocalDate date,
        Long journalNo,
        Long corpId,
        String corpName,
        String trName,
        String note,
        boolean fixYn
) {
}
