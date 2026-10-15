package kr.co.kfs.asseterp.biz.sms.dto;

import java.math.BigDecimal;

/**
 * AS-IS Sms02_HistoryModel — selectByTotalCountYear: 사용연도·사용건수·사용금액.
 * 사용금액은 건당 9.5라 소수가 나온다(numeric). Long으로 받으면 JDBC가 거부하므로 BigDecimal로 받고, 화면 `gb.long`(fmtLong)이 정수로 보여 준다.
 */
public record HistoryYearRes(Long historyId, String year, Long totalCount, BigDecimal totalPayCount) {
}
