package kr.co.kfs.asseterp.biz.apr.dto;

/** 날인신청 한 줄 (apr16_stamp_doc.selectByApprId, V01) */
public record AprApprStampApplRes(Long stampDocId, String applTypeName, String stampReprCorpName, Long applQty, String stampOutYn) {
}
