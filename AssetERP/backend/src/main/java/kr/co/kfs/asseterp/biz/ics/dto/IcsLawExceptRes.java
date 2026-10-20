package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규 사용여부 설정 창 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Lookup_Except 그리드 열, H08). exceptYn은 'true'(미사용)/'false' 글자 */
public record IcsLawExceptRes(Long classTreeId, String classTreeCode, String classTreeFullName, String cycleName, String exceptYn) {
}
