package kr.co.kfs.asseterp.biz.sms.dto;

import java.time.LocalDate;

/** selectByDate 파라미터 (searchText는 LIKE 패턴까지 만든 값) */
public record HistorySearchParam(Long companyId, LocalDate startDate, LocalDate closeDate, String searchText, Long limit) {
}
