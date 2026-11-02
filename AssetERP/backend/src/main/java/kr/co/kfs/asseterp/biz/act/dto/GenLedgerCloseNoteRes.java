package kr.co.kfs.asseterp.biz.act.dto;

/** 마감현황(checkGrid) 한 줄 — AS-IS는 genLedgerId(f_create_seq)를 행 키로 썼다 */
public record GenLedgerCloseNoteRes(Long genLedgerId, String note) {
}
