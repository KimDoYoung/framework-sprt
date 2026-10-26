package kr.co.kfs.asseterp.biz.com.dto;

/** 상세코드별 데이터맵핑 양식 (AS-IS com11_form_mapping_multi). 저장된 양식이 없으면 번호만 새로 받은 빈 양식 */
public record FormMappingMultiRes(Long formMappingMultiId, Long companyId, String sysKindCode, String sysDetailCode,
                                  String linkCode, String content, String note) {
}
