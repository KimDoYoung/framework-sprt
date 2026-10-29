package kr.co.kfs.asseterp.biz.apr.dto;

/** 인감 및 대표명의 선택 창(AS-IS selectByApplType). stampDocId는 ROW_NUMBER */
public record AprStampDocLookupRes(Long stampDocId, String applTypeName, String applType, String stampReprCorpName,
                                   Long stampId, Long reprCorpId) {
}
