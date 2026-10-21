package kr.co.kfs.asseterp.biz.flt.dto;

/** 투자한도·현재 투자금액 (AS-IS flt02_emp.selectInvestLimit) */
public record EmpLimitRes(
        Boolean investAmtOverCheckYn,
        Long yearInvestLimit,
        Long yearInvestAmt,
        Long totalInvestLimit,
        Long totalInvestAmt) {
}
