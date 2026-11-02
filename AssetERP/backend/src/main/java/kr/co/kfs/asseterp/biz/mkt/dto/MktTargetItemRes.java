package kr.co.kfs.asseterp.biz.mkt.dto;

/** Z06 활동처 조회창(Mkt01_Lookup_TargetCompany2) 한 행 — 활동처 + 구분 이름 */
public record MktTargetItemRes(Long targetCompanyId, String targetCompanyName, String itemTypeName) {
}
