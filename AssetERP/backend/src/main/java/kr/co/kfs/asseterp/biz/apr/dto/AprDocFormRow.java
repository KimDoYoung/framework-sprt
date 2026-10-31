package kr.co.kfs.asseterp.biz.apr.dto;

/** [양식] 창 목록 한 줄 (AS-IS Dcr05_DocTypeModel) */
public record AprDocFormRow(Long docTypeId, String formClassName, String title, String note, String content) {
}
