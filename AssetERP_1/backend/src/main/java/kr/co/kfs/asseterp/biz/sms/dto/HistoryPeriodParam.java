package kr.co.kfs.asseterp.biz.sms.dto;

/** selectByTotalCountYear(locName) / selectByTotalCountMonth(locName, year) 파라미터 */
public record HistoryPeriodParam(String locName, String year) {
}
