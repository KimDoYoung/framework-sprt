package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 저장 — 매수관리 그리드의 발급·사용매수와 등록 창(Apr16_Lookup_StampDocReg)의 입력값. stampDocId가 없거나 0 이하면 새 행 */
public record AprStampDocSaveReq(Long stampDocId, LocalDate regDate, String applType, Long stampId, Long reprCorpId,
                                 Long docIssueQty, Long docUseQty, String provideCo, String purpose, String note, Long apprId) {
}
