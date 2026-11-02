package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

public record BookFundFeeParam(Long companyId, LocalDate holdDate, Long corpId, String searchText) {
}
