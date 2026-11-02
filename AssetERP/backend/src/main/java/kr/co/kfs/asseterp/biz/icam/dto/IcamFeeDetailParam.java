package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

public record IcamFeeDetailParam(Long companyId, Long corpId, String fundCode, LocalDate stdDate, String searchText) {
}
