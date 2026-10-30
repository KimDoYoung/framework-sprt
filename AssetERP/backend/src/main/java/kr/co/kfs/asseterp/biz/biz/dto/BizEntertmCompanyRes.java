package kr.co.kfs.asseterp.biz.biz.dto;

/** 거래처별 제공금액 한 줄 (AS-IS Biz02_PersonModel — selectByEntertmExpense) */
public record BizEntertmCompanyRes(Long personId, String targetCompanyName, String htmlTargetCompanyName, Long entertmExpenseSum) {
}
