package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS Mkt04_RelateFundModel (selectByHistoryId) */
public record MktRelateFundRes(Long relateFundId, Long historyId, Long fundId, String fundCode, String fundName) {
}
