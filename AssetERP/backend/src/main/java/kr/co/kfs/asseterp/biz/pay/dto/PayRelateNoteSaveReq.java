package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 비고 저장 한 행 — relateNoteId가 없으면 새 행 */
public record PayRelateNoteSaveReq(Long relateNoteId, LocalDate payDate, String payCd, String noteType, Long personId, String note) {
}
