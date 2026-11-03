package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz13_WithCorp.update — withCorpId 가 0 이하(새 행)이면 INSERT */
public record BizContWithCorpReq(Long withCorpId, Long contCorpId, String manageType, Long corpId, LocalDate firstStartDate, LocalDate lastCloseDate) {
}
