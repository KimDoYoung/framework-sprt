package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규 분류 트리 한 노드 (Icr01_Lookup_SelectParent) */
public record IcrClassTreeRes(Long classTreeId, Long parentTreeId, String classTreeCode, String classTreeName, String seq,
                              String deadlineFullName, Integer depth) {
}
