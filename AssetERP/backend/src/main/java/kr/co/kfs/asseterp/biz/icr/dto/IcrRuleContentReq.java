package kr.co.kfs.asseterp.biz.icr.dto;

/**
 * 내규 상세내용 저장 (Icr01_Lookup_Content.update → icr.Icr01_ClassTree.modelUpdate).
 * 원본은 열기 전에 그리드에서 고치던 값(modified())까지 모델에 반영해 한 행을 통째로 저장하므로 상세내용과 함께 그 행의 편집 열을 받는다
 */
public record IcrRuleContentReq(String content, String classTreeCode, String classTreeName, String submitTo, String relatedLaw, String useYn) {
}
