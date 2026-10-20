package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규조회 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ClassTreeUserView 그리드 열 + 보기 창들이 쓰는 id, H02). 일임 여부는 'true'/'false' 문자 */
public record IcsLawViewRes(Long classTreeId, String classTreeCode, String classTreeName, String content, String submitTo, String relatedLaw,
                            String revisionCount, String cycleName, String fileCount, String parentTreeFullName, String advisYn) {
}
