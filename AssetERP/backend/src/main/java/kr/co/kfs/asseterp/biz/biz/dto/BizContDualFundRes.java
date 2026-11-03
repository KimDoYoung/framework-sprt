package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz17_dual_manage_fund.selectByContCorpId — 이중사무관리 펀드 */
public record BizContDualFundRes(Long dualFundId, Long companyId, Long contCorpId, String fundCd, LocalDate startDate, Double fundFee,
                                 Double fundSubFee, String note, String positionType, String positionTypeNm, String fundNm) {
}
