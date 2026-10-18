package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서양식 (AS-IS Dcr05_DocTypeModel — Dcr05_Lookup_DocType 그리드, Dcr05_Edit_Update) */
public record DcrDocTypeRes(Long docTypeId, Long companyId, String title, String content, String note,
                            String docFormClassCode, String docFormClassName) {
}
