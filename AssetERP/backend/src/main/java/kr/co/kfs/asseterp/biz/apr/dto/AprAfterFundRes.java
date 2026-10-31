package kr.co.kfs.asseterp.biz.apr.dto;

/** [연관펀드설정] 창 한 줄 (AS-IS Apr03_RelateFundModel, apr03_relate_fund.selectByAfterYn, V16) */
public record AprAfterFundRes(Long relateFundId, Long fundId, String fundTypeName, String fundCode, String fundName, String printYn, String afterYn) {
}
