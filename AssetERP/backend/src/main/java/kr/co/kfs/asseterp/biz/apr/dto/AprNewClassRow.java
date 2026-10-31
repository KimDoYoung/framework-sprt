package kr.co.kfs.asseterp.biz.apr.dto;

/** 새 문서의 문서분류 (dcr01_class_tree, V06) */
public record AprNewClassRow(Long classTreeId, String classTreeFullName, String approvalTypeCode, String sealCode, String printFundYn) {
}
