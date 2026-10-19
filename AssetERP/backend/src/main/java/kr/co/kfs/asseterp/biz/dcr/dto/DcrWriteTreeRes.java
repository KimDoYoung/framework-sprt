package kr.co.kfs.asseterp.biz.dcr.dto;

/** 업무별 문서작성 트리 한 줄 (AS-IS Dcr01_ClassTreeModel 중 화면이 쓰는 값). depth는 1부터, updateYn은 작성권한(dcr03_update_yn) */
public record DcrWriteTreeRes(Long classTreeId, Long parentTreeId, String classTreeName, String typeCode, String note, Integer depth, boolean updateYn) {
}
