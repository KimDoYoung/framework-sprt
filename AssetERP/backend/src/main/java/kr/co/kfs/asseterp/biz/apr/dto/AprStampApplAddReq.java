package kr.co.kfs.asseterp.biz.apr.dto;

/** 날인신청 한 줄 더하기 (Apr16_Lookup_StampApplQty.update L146-181) — applType 1 법인인감증명서 / 2 법인등기부등본 / 3 인감날인. outYn은 3만 */
public record AprStampApplAddReq(String applType, Long stampReprCorpId, Long qty, Boolean outYn) {
}
