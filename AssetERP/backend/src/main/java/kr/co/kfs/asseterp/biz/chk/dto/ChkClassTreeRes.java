package kr.co.kfs.asseterp.biz.chk.dto;

/** Chk01_Tab_ClassTree 트리 그리드 한 행 (AS-IS chk01_class_tree.selectByParentId) — 전위 순서로 평평하게, depth는 0부터 */
public record ChkClassTreeRes(Long classTreeId, Long companyId, Long parentTreeId, String classTreeName, Long seq,
                              String useYn, String note, String linkCode, String linkName, int depth) {
}
