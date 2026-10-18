package kr.co.kfs.asseterp.biz.sch.dto;

/** 주간사 저장 (Sch12_Lookup_IpoCorp.update). ipoCorpId가 없거나 0 이하면 새 행 */
public record Sch12IpoCorpSaveReq(Long ipoCorpId, String corpName, String homepage) {
}
