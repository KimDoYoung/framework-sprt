package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규 저장 한 행 — 그리드에서 고치는 열(분류코드·내규명·제출처·관련조문·사용여부). 새 행은 classTreeId가 0 이하이고 parentTreeId에 선택한 분류가 온다 */
public record IcrRuleSaveReq(Long classTreeId, Long parentTreeId, String classTreeCode, String classTreeName, String submitTo, String relatedLaw,
                             String useYn) {
}
