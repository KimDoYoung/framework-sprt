package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** sch01_info.selectByOrg 조건. cycleCode는 전체가 '%', dailyYn은 'true'/'false' 글자, searchText는 LIKE 패턴(%글자%) */
public record Sch01OrgSearchCond(Long companyId, Long orgId, boolean subOrgYn, LocalDate startDate, LocalDate endDate, String dailyYn,
                                 String cycleCode, String searchText) {
}
