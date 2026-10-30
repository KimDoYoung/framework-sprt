package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** act03_journal_dtl.selectBizCard·selectChargeFee·selectErpChargeFee·selectByJournalId 한 행 (급여/카드 회계처리 아래 분개 그리드, U10) */
public record JournalBizLineRes(Long journalDtlId, LocalDate date, String journalNoStr, String note,
                                String drAccountCode, String drAstAccountName, Long drAmt, String drNote,
                                String crAccountCode, String crAstAccountName, Long crAmt, String crNote) {
}
