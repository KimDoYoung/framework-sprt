package kr.co.kfs.asseterp.biz.ics.dto;

/** AS-IS Ics41_DcrType.update(UpdateDataModel) — dcrTypeId가 0 이하면 새 행 */
public record IcsDcrTypeSaveReq(Long dcrTypeId, String dcrTypeCode, String dcrTypeName, boolean adYn, boolean useYn) {
}
