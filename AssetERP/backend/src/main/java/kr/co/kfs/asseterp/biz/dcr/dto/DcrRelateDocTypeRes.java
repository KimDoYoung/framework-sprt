package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서구분에 연결된 문서양식 (AS-IS Dcr06_RelateDocTypeModel — Dcr06_Lookup_Form 그리드) */
public record DcrRelateDocTypeRes(Long relateDocTypeId, Long classTreeId, Long docTypeId, String title, String defaultYn, String note) {
}
