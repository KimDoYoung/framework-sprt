package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** act03_journal_dtl.selectByCompanyId 파라미터. corpIdStr·trCode·searchText는 LIKE 패턴, abroType 0 전체 · 1 국내 · 2 국외 */
public record JournalDtlCond(Long companyId, LocalDate startDate, LocalDate closeDate, String corpIdStr, String searchText,
                             String trCode, String abroType, Long checkedGroupId) {
}
