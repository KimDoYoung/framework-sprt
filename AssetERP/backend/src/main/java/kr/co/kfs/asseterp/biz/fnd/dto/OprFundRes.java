package kr.co.kfs.asseterp.biz.fnd.dto;

/** 수요예측 펀드별 신청 한 행 — AS-IS Fnd31_OprFundModel (fnd31_opr_fund.selectByOprId). fundAdviceType 1:운용펀드 / 2:일임(자문) */
public record OprFundRes(Long oprFundId, Long oprId, Long fundId, String fundAdviceType, String fundCode, String fundName,
                         Long price, Long qty, Long settleAmt) {
}
