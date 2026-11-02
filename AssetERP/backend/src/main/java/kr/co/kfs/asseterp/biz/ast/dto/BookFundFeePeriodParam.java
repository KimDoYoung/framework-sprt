package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

public record BookFundFeePeriodParam(Long companyId, LocalDate startDate, LocalDate closeDate, String searchText, int offset, int limit) {
}
