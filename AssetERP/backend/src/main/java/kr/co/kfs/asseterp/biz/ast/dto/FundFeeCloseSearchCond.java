package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** selectEvalFundFee 조건 — corpIdStr은 "%"(전체) 또는 운용사ID 문자열 */
public record FundFeeCloseSearchCond(Long companyId, LocalDate holdDate, String corpIdStr, String searchText) {
}
