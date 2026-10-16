package kr.co.kfs.asseterp.biz.sys.dto;

/** selectByTotalSizeYear(locName) / selectByTotalSizeMonth(locName, year) 파라미터 */
public record FileTotalParam(String locName, String year) {
}
