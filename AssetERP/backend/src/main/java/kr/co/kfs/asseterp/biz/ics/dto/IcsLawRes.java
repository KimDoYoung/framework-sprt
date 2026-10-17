package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Grid_IcsType 그리드 열 + 저장·이동에 쓰는 id). advisYn은 DB 형태('true'/'false') 그대로 */
public record IcsLawRes(Long classTreeId, Long parentTreeId, String classTreeCode, String classTreeName, String content, String submitTo,
                        String cycleName, String fileCount, String relatedLaw, String revisionCount, String tdmCount, String advisYn,
                        Long companyId) {
}
