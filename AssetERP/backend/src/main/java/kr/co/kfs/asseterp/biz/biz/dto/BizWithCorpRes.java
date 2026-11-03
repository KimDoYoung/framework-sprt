package kr.co.kfs.asseterp.biz.biz.dto;

/** biz13_with_corp.selectByText — 운용사 조회창(Biz13_Lookup_WithCorp) */
public record BizWithCorpRes(Long withCorpId, Long corpId, String manageType, String corpCd, String corpNm, String manageTypeNm) {
}
