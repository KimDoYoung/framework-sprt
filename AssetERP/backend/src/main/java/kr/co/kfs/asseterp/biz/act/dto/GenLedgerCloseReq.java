package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** procType: P 회계마감 · C 마감취소 · A 마감검증 */
public record GenLedgerCloseReq(LocalDate closeDate, String procType, Boolean depositUpdateYn, Boolean genLedgerUpdateYn) {
}
