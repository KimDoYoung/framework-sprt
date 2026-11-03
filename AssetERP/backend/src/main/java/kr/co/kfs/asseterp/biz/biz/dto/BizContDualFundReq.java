package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz17_DualManageFund.update — dualFundId 가 0 이하(새 행)이면 INSERT */
public record BizContDualFundReq(Long dualFundId, Long contCorpId, String fundCd, LocalDate startDate, Double fundFee, Double fundSubFee, String positionType) {
}
