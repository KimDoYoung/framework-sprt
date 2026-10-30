package kr.co.kfs.asseterp.biz.apr.dto;

/** 연관펀드 탭 한 줄 (apr03_relate_fund.selectByApprId 중 Apr03_Page_Relate.buildRelateFundGrid 열, V01) */
public record AprApprFundRes(Long relateFundId, String fundTypeName, String fundCode, String fundName, String afterYn, String printYn) {
}
