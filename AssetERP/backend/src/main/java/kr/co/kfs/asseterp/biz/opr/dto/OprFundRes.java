package kr.co.kfs.asseterp.biz.opr.dto;

import java.time.LocalDate;

/** 연관펀드 한 줄 (AS-IS Opr02_FundModel — opr02_fund.selectByCreateId, EE100). regFundId = 고른 펀드의 번호 */
public record OprFundRes(Long fundId, Long regFundId, String fundCode, String fundName, String fundTypeName, String empName1,
                         LocalDate startDate, String publicName, String orgCodeName) {
}
