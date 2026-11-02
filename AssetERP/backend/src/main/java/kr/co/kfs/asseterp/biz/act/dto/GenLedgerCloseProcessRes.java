package kr.co.kfs.asseterp.biz.act.dto;

import java.util.List;

/** status 1 성공 · -1 실패(message). notes는 실패여도 마감현황 그리드에 채운다. */
public record GenLedgerCloseProcessRes(int status, String message, List<GenLedgerCloseNoteRes> notes) {
}
