package kr.co.kfs.asseterp.biz.biz.dto;

/** biz13_with_corp.selectByContCorpId2 — 계약사의 운영 운용사(자산운용/자문/일임) (자료생성 내부용) */
public record BizFeeWithCorpRow(Long contCorpId, Long corpId, Long companyId, String manageType, String corpCd, String corpNm) {
}
