package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 계정별원장 SQL 파라미터. corpIdStr·depositIdStr·trCode·searchText는 LIKE 패턴 */
public record JournalSubCond(Long companyId, LocalDate startDate, LocalDate closeDate, String accountCode, String trCode,
                             String corpIdStr, String depositIdStr, String searchText) {
}
