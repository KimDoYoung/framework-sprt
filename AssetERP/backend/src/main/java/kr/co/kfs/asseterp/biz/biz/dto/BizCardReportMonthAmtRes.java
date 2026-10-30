package kr.co.kfs.asseterp.biz.biz.dto;

/** 사용자별 월별 사용금액 한 줄 (AS-IS Biz01_PromoModel 의 empName·janSum~decSum·totalSum) */
public record BizCardReportMonthAmtRes(String empName, Long janSum, Long febSum, Long marSum, Long aprSum, Long maySum, Long junSum,
                                       Long julSum, Long augSum, Long sepSum, Long octSum, Long novSum, Long decSum, Long totalSum) {
}
