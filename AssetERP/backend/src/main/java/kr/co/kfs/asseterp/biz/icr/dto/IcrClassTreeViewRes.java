package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규조회(Icr01_Tab_ClassTreeView) 그리드 한 행 — AS-IS Icr01_ClassTreeModel 중 그리드 열 + id */
public record IcrClassTreeViewRes(
        Long classTreeId,
        String classTreeCode,
        String classTreeName,
        String content,
        String submitTo,
        String relatedLaw,
        String cycleName,
        String fileCount,
        String parentTreeFullName) {
}
