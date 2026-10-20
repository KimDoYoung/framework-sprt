package kr.co.kfs.asseterp.biz.apr.dto;

/** AS-IS Apr15_ReprCorpModel — 추가 대표명의 한 행 (G08). 논리 값은 'true'/'false' 문자열 */
public record AprReprCorpRes(Long reprCorpId, String corpType, String corpTypeName, String corpName, String reprName,
                             String corpRegYn, Long stampId, String stampName, String note, String useYn) {
}
