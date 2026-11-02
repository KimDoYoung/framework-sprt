package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** ast30_book_fund_fee.selectFundFeeBook 조건 (X31). fundCode가 null이면 펀드 조건 없음 */
public record BookFundFeeStateParam(Long companyId, LocalDate startDate, LocalDate closeDate, String fundCode, String searchText) {
}
