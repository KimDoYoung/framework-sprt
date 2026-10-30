package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;
import java.util.List;

/** 전표변경 창(Act02_Lookup_ModiJournal) 열 때 값: 전표 머리(act02_journal) + 임시분개 줄 */
public record JournalEditRes(
        Long journalId,
        LocalDate date,
        Long journalNo,
        Long corpId,
        String corpName,
        String trName,
        String note,
        boolean fixYn,
        List<JournalTmpRes> lines
) {
}
