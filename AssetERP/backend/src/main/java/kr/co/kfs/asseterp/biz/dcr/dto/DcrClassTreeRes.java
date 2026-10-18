package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 트리 한 행 (AS-IS Dcr01_ClassTreeModel — selectByParentId1Bang). 전위 순서 평평한 목록 + depth(0부터) */
public record DcrClassTreeRes(Long classTreeId, Long companyId, Long parentTreeId, String classTreeName, String classTreeCode,
                              String seq, String note, String typeCode, String useYn, String adminYn, Integer depth) {
}
