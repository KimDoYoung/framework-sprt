package kr.co.kfs.asseterp.biz.icr.dto;

/** 내규 한 행 (AS-IS Icr01_ClassTreeModel 중 Icr01_Grid_IcrType 그리드 열 + 저장·이동에 쓰는 id). useYn은 DB 형태('true'/'false') 그대로 */
public record IcrRuleRes(Long classTreeId, Long parentTreeId, String classTreeCode, String classTreeName, String content, String submitTo,
                         String cycleName, String managerGroupName, String fileCount, String relatedLaw, String useYn, Long companyId) {
}
