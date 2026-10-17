package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규상세 창 값 (AS-IS Ics01_ClassTreeModel 중 Ics01_Lookup_ClassTreeDetail 폼, E03-1). 기한은 법규에 걸린 기한 이름을 ', '로 이은 문자열 */
public record IcsLawDetailRes(Long classTreeId, String classTreeCode, String classTreeName, String classTreeFullName, String content, String relatedLaw,
                              String submitTo, String deadlineName) {
}
