package kr.co.kfs.asseterp.biz.dcr.dto;

/** AS-IS UpdateDataModel(dcr30_link)이 바꾸는 열: 문서분류ID·비고 */
public record DcrLinkSaveReq(Long linkId, Long classTreeId, String note) {
}
