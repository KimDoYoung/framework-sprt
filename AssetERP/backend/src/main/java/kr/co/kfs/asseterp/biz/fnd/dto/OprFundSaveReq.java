package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드별 수요예측 신청 한 건 (AS-IS Fnd31_Edit_DemandOprFund.update → fnd.Fnd31_OprFund.modelUpdate). oprFundId가 없거나 0 이하면 새 행 */
public record OprFundSaveReq(Long oprFundId, Long oprId, Long fundId, String fundAdviceType, Long price, Long qty, Long settleAmt) {
}
