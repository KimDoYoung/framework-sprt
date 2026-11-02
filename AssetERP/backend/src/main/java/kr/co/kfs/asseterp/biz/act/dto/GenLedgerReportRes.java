package kr.co.kfs.asseterp.biz.act.dto;

/** 재무제표 한 줄 — AS-IS act04_gen_ledger.selectBSPL (과목 / 당기금액 / 전기금액) */
public record GenLedgerReportRes(Long genLedgerId, String accountName2, Long curBalAmt, Long preBalAmt) {
}
