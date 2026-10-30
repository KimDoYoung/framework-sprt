package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** act02_journal.selectMonthBiz 한 행 (급여/카드 회계처리 위 그리드, U10) — rowKey는 전표가 없는 행의 행번호 */
public record JournalBizRes(Long rowKey, Long journalId, Long retireId, Long companyId, String note, String trCode, Long trCount, Long journalAmt,
                            String bizCloseYn, String journalYn, String fixYnName, String accountCloseYn, LocalDate date, String payMonthCode) {
}
