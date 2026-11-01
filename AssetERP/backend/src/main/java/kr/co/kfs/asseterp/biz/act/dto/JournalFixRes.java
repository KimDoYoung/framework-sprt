package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** act02_journal.selectByDateAll / selectById — 전표승인처리 Act02_Tab_JournalFix 위 그리드 한 행 */
public record JournalFixRes(Long journalId, Long companyId, LocalDate date, Long journalNo, String journalNoStr, Long corpId, String corpName,
                            String trName, String note, String curCode, Long journalAmt, String personName, String dcrCountStr,
                            boolean fixYn, String fixYnName, String fixPersonName, String fixDateStr) {
}
