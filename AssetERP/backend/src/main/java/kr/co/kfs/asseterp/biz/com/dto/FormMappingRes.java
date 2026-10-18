package kr.co.kfs.asseterp.biz.com.dto;

/** AS-IS Com10_FormMappingModel (com10_form_mapping.selectById) */
public record FormMappingRes(Long formMappingId, Long companyId, String linkCode, String title, String content,
                             String defaultYn, String note) {
}
