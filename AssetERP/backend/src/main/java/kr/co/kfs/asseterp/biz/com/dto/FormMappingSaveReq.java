package kr.co.kfs.asseterp.biz.com.dto;

/** AS-IS com.Com10_FormMapping.modelUpdate: 양식 번호(없으면 새로)·연결할 Link ID·양식 내용 */
public record FormMappingSaveReq(Long formMappingId, Long linkId, String content) {
}
