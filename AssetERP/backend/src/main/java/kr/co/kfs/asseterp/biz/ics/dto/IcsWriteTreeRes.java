package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규별 문서작성 왼쪽 트리 한 노드(Ics01_Tab_ApprList). typeCode IC 법규분류·IT 법규구분, content는 작성 Tip */
public record IcsWriteTreeRes(Long classTreeId, Long parentTreeId, String classTreeCode, String classTreeName, String typeCode, String content, Integer depth) {
}
