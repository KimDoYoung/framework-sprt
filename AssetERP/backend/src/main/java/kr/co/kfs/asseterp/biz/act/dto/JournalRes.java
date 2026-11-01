package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** act02_journal.selectByDate / selectById — 전표 한 행 (Act02_Tab_CreateJournal 위 그리드, Act02_Lookup_JournalList). journalNoStr = journalNo 글자 */
public record JournalRes(Long journalId, Long companyId, LocalDate date, Long journalNo, String journalNoStr, Long corpId, String corpName,
                         String note, Long journalAmt, String personName, String dcrCountStr, boolean fixYn, String fixYnName,
                         String closeName, String curCode) {
}
