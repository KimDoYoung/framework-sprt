package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규 분류 한 노드 (AS-IS Ics01_ClassTreeModel 중 IcsComboBoxField·Ics01_Lookup_CheckList가 쓰는 열, H04). parentTreeName = 바로 위 분류 이름 */
public record IcsClassTreeItemRes(Long classTreeId, String classTreeName, String parentTreeName) {
}
