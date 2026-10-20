package kr.co.kfs.asseterp.biz.apr.dto;

/** 추가 대표명의 저장 한 행 (G08) — 화면이 바꾸는 열만. reprCorpId가 없거나 0 이하면 새 행 */
public record AprReprCorpSaveReq(Long reprCorpId, String corpType, String corpName, String reprName,
                                 String corpRegYn, Long stampId, String note, String useYn) {
}
