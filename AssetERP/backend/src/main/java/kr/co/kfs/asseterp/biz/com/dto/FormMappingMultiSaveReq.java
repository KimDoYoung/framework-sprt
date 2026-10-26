package kr.co.kfs.asseterp.biz.com.dto;

/** 상세코드별 양식 저장 (AS-IS com.Com11_FormMappingMulti.modelUpdate). formMappingMultiId가 없으면 새 번호 */
public record FormMappingMultiSaveReq(Long formMappingMultiId, String sysKindCode, String sysDetailCode, String linkCode, String content) {
}
