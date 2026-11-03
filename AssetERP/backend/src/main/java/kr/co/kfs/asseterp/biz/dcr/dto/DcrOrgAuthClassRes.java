package kr.co.kfs.asseterp.biz.dcr.dto;

/** 조직별 문서분류 맵핑 트리 한 행 (AS-IS Dcr01_ClassTreeModel 중 Dcr03_TabPage_OrgAuth 열 + dcr03_org_auth). 전위 순서 + depth(0부터). 조회·작성은 'true'/'false' */
public record DcrOrgAuthClassRes(Long classTreeId, Long parentTreeId, Integer depth, String classTreeName,
                                 String retrieveYn, String updateYn, String seq, String note) {
}
