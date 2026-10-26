package kr.co.kfs.asseterp.biz.fnd.dto;

/**
 * 펀드별 신청·배정 한 행 — AS-IS Fnd31_OprFundModel (fnd31_opr_fund.selectByOprId). fundAdviceType 1:운용펀드 / 2:일임(자문).
 * 수요예측은 qty·settleAmt만, 공모주청약은 price·contAmt·fee까지 쓴다
 */
public record OprFundRes(Long oprFundId, Long oprId, Long fundId, String fundAdviceType, String fundCode, String fundName,
                         Long price, Long qty, Long contAmt, Long fee, Long settleAmt) {
}
