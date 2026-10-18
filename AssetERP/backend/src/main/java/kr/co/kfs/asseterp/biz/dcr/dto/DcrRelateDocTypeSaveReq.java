package kr.co.kfs.asseterp.biz.dcr.dto;

/** 연결 문서양식 저장. relateDocTypeId가 0 이하면 새 행 */
public record DcrRelateDocTypeSaveReq(Long relateDocTypeId, Long classTreeId, Long docTypeId, String defaultYn, String note) {
}
