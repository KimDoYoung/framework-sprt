package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 분개장 한 줄 (act03_journal_dtl.selectByCompanyId, X15) — 전표(act02) 열 + 분개(act03) 열. 출력 체크(printYn)는 DB 열이 아니라 화면 전용이다 */
public record JournalDtlListRes(Long journalId, Long journalDtlId, Long seq, String journalDateNo,
                                LocalDate date, Long journalNo, String trName, String corpName, String note, String curCode, String closeName,
                                String drAccountCode, String drAccountName, Long drAmt, Double drForAmt,
                                String crAccountCode, String crAccountName, Long crAmt, Double crForAmt) {
}
