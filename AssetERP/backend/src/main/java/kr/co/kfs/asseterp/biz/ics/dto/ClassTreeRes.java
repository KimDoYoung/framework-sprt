package kr.co.kfs.asseterp.biz.ics.dto;

/** 내부통제 분류 트리 한 노드 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ClassTree 트리 열 + 수정 창 값). 서버가 전위 순서 평평한 목록과 depth를 준다 */
public record ClassTreeRes(Long classTreeId, Long parentTreeId, String classTreeCode, String classTreeName, String seq, String deadlineFullName,
                           Integer depth) {
}
