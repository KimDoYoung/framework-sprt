package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 개요 (AS-IS dcr01_class_tree: 구분코드 + 개요) */
public record ClassTreeNoteRow(Long companyId, String classTreeCode, String note) {
}
