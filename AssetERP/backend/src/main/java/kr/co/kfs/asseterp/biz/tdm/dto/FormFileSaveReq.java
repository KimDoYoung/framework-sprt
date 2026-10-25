package kr.co.kfs.asseterp.biz.tdm.dto;

/** 연관양식 저장 한 행 — 화면에서 바꿀 수 있는 구분 코드·비고만 */
public record FormFileSaveReq(Long fileId, String tdmCheckFormType, String note) {
}
