package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

public record IcamFeeBookParam(Long companyId, LocalDate stdDate, String searchText, String fundCode, int offset, int limit) {
}
