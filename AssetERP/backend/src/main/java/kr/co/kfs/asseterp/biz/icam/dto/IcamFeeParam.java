package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** icam10_fee.selectByFeeTypePaging·Total·selectByFeeType 조건 (AS-IS 파라미터 Map → record). fundCode가 null이면 펀드 조건 없음(X29) */
public record IcamFeeParam(Long companyId, String feeType, LocalDate startDate, LocalDate closeDate, String searchText, String fundCode, int offset, int limit) {
}
