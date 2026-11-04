package kr.co.kfs.asseterp.biz.dcr.dto;

/** 리서치용 문서분류 트리 한 행 (AS-IS Dcr01_ClassTreeModel — selectByParentIdResrchYn). 전위 순서 평평한 목록 + depth(0부터) */
public record DcrResearchTreeRes(Long classTreeId, Long parentTreeId, String classTreeName, String classTreeCode, String typeCode,
                                 String researchYn, Integer depth) {
}
