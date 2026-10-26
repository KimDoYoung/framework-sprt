package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * sch01_info.selectByCloseDate 조건. classId는 전체면 null, shareType은 전체 '%'·나의 스케줄 '1'·공유 스케줄 '2',
 * cycleCode는 전체가 '%', dailyYn은 'true'/'false' 글자, searchText는 LIKE 패턴(%글자%)
 */
public record Sch01PeriodSearchCond(Long companyId, Long personId, Long orgId, LocalDate startDate, LocalDate endDate, Long classId,
                                    String shareType, String cycleCode, String dailyYn, String searchText) {
}
