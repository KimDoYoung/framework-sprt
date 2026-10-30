package kr.co.kfs.asseterp.biz.biz.dto;

/** 사용항목별 합계 한 줄 (AS-IS Biz03_AccountMapModel 의 useItemCode·Name·Sum). 코드 99 = 기타 */
public record BizCardReportItemSumRes(String useItemCode, String useItemName, Long useItemSum) {
}
