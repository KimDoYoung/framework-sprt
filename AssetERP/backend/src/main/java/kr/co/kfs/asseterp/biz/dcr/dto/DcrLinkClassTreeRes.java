package kr.co.kfs.asseterp.biz.dcr.dto;

/** Link 코드에 지정된 문서분류 (AS-IS dcr01_class_tree.selectByLinkCode → Dcr01_ClassTreeModel 중 쓰는 값, L06) */
public record DcrLinkClassTreeRes(Long classTreeId, String classTreeFullName) {
}
