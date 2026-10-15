package kr.co.kfs.asseterp.biz.sms.dto;

import java.math.BigDecimal;

/** AS-IS Sms02_HistoryModel — selectByTotalCountMonth: 사용월·사용건수·사용금액 (사용금액은 HistoryYearRes와 같은 이유로 BigDecimal) */
public record HistoryMonthRes(Long historyId, String month, Long totalCount, BigDecimal totalPayCount) {
}
