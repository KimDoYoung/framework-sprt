package kr.co.kfs.asseterp.biz.sch.dto;

/** sch01_info.selectByText 조건. classId는 전체면 null, cycleCode는 전체가 '%', searchText는 LIKE 패턴(%글자%) */
public record Sch01InfoSearchCond(Long companyId, Long userId, Long classId, String cycleCode, String searchText, boolean dailyYn, boolean useYn) {
}
