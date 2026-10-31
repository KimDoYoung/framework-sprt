package kr.co.kfs.asseterp.biz.apr.dto;

/** 대표명의 선택 창(AS-IS Apr15_Lookup_ReprCorp — selectByCompanyId). 법인 추가(companyAddYn)면 회사 자신이 한 행. stampId는 대표명의에 지정된 인감(문서창 [대표회사] 선택 뒤 인감 채움, V12) */
public record AprReprCorpLookupRes(Long reprCorpId, String corpTypeName, String corpName, String reprName, Long stampId) {
}
