package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규 분류 조회창 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Lookup_SelectMulti 그리드 열 + 상세내용 보기용 id, E03) */
public record IcsLawLookupRes(Long classTreeId, String classTreeCode, String classTreeName, String content, String submitTo, String cycleName,
                              String relatedLaw, String classTreeFullName) {
}
