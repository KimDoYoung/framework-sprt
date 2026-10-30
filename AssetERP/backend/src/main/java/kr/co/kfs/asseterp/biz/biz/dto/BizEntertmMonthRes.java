package kr.co.kfs.asseterp.biz.biz.dto;

/** 월별 제공금액 누계 한 줄 (AS-IS Biz01_PromoModel 의 empName·janSum~decSum·totalSum, promoId = 키) */
public record BizEntertmMonthRes(Long promoId, String empName, Long janSum, Long febSum, Long marSum, Long aprSum, Long maySum, Long junSum,
                                 Long julSum, Long augSum, Long sepSum, Long octSum, Long novSum, Long decSum, Long totalSum) {
}
