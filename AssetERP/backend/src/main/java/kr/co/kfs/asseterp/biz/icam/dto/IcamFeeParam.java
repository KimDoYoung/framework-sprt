package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** icam10_fee.selectByFeeTypePaging·Total 조건 (AS-IS 파라미터 Map → record) */
public record IcamFeeParam(Long companyId, String feeType, LocalDate startDate, LocalDate closeDate, String searchText, int offset, int limit) {
}
