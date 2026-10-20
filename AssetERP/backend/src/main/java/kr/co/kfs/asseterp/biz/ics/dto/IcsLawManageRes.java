package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * 법규관리 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ClassTreeUser 그리드 열 + 보기 창들이 쓰는 id, H08).
 * advisYn·exceptYn·autoYn은 'true'/'false' 글자(회사별 ics03_company_info가 법규 기본값을 덮는다)
 */
public record IcsLawManageRes(Long classTreeId, String classTreeCode, String classTreeName, String content, String submitTo, String relatedLaw,
                              String revisionCount, String cycleName, String fileCount, String parentTreeFullName, String advisYn,
                              String managerGroupName, String exceptYn, String autoYn) {
}
