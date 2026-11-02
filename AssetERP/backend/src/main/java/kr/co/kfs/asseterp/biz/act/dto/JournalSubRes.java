package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 계정별원장 한 줄 (act03_journal_dtl.selectByAccountCode, X17) — 첫 줄은 전월이월(journalId 0, 거래유형 "전월이월") */
public record JournalSubRes(Long journalDtlId, LocalDate date, Long journalNo, String journalNoStr, Long journalId,
                            String trCode, String trName, String corpName, String note, String accountCode, String accountName,
                            Long drAmt, Long crAmt, String drAstName, String drNote, Long balAmt) {
}
