package kr.co.kfs.asseterp.biz.flt.dto;

/** 투자한도 그리드 한 행 (AS-IS flt10_tr.selectInvestLimit — 1 한도, 2 현재 투자금액(사전신고 포함), 3 현재 투자금액(사전신고 제외)) */
public record InvestLimitRes(
        Long trId,
        String checkTypeName,
        Long yearInvestLimit,
        Long totalInvestAmt,
        Double turnoverRate,
        Long monthBuyCount,
        Long dayBuyCount) {
}
