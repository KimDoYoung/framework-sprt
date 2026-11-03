package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 하위 조회(AS-IS dcr01_class_tree.selectByClasssTreeId)의 한 건 — 권한 저장에 필요한 ID와 회사 */
public record DcrClassTreeRef(Long classTreeId, Long companyId) {
}
