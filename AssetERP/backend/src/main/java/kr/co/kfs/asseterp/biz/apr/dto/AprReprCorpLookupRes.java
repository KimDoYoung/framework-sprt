package kr.co.kfs.asseterp.biz.apr.dto;

/** 대표명의 선택 창(AS-IS Apr15_Lookup_ReprCorp — selectByCompanyId). 법인 추가(companyAddYn)면 회사 자신이 한 행 */
public record AprReprCorpLookupRes(Long reprCorpId, String corpTypeName, String corpName, String reprName) {
}
