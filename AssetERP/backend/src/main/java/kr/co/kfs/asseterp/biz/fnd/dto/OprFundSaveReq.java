package kr.co.kfs.asseterp.biz.fnd.dto;

/**
 * 펀드별 신청·배정 한 건 (AS-IS Fnd31_Edit_DemandOprFund·Fnd31_Edit_OprFund.update → fnd.Fnd31_OprFund.modelUpdate). oprFundId가 없거나 0 이하면 새 행.
 * contAmt·fee는 공모주청약 배정 창만 보낸다(수요예측은 null)
 */
public record OprFundSaveReq(Long oprFundId, Long oprId, Long fundId, String fundAdviceType, Long price, Long qty, Long contAmt, Long fee,
                             Long settleAmt) {
}
