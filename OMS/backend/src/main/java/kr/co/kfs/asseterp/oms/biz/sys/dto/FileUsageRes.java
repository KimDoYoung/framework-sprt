package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.math.BigDecimal;

/**
 * 고객별 서버사용량 (AS-IS sys10_file.selectByTotalSize)
 *
 * @param totalSize 누적 사용용량(MB, sys10_size 합 × 0.001)
 */
public record FileUsageRes(String companyNm, String locNm, BigDecimal totalSize) {
}
