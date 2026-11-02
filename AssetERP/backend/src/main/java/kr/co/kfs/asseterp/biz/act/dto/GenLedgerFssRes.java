package kr.co.kfs.asseterp.biz.act.dto;

/** 금감원보고용 재무제표 한 줄 — AS-IS act04_gen_ledger.selectFssBSPL (코드 / 과목 / 당기금액) */
public record GenLedgerFssRes(Long genLedgerId, String accountCode, String accountName2, Long curBalAmt) {
}
