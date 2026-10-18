package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서양식 수정 (Dcr05_Edit_Update.updateEdit) */
public record DcrDocTypeUpdateReq(String title, String content, String note, String docFormClassCode) {
}
