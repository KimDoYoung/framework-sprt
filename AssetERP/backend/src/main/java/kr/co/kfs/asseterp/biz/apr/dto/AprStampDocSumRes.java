package kr.co.kfs.asseterp.biz.apr.dto;

/** 위쪽 합계 그리드(AS-IS selectDocGroupSum) */
public record AprStampDocSumRes(Long stampDocId, String applTypeName, String stampReprCorpName,
                                Long docIssueQty, Long docUseQty, Long docRemainQty) {
}
