package kr.co.kfs.asseterp.biz.biz.dto;

/** biz13_with_corp.selectByText — 운용사 조회창(Biz13_Lookup_WithCorp). contCorpId 는 최저보수 청구 편집창(EE21)이 계약사를 정하는 데 쓴다 */
public record BizWithCorpRes(Long withCorpId, Long corpId, String manageType, String corpCd, String corpNm, String manageTypeNm, Long contCorpId) {
}
