package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.math.BigDecimal;

/**
 * 연도·월별 사용량 (AS-IS sys10_file.selectByTotalSizeYear / selectByTotalSizeMonth)
 *
 * @param period 연도(yyyy) 또는 월(mm)
 */
public record FileUsagePeriodRes(String period, BigDecimal totalSize) {
}
