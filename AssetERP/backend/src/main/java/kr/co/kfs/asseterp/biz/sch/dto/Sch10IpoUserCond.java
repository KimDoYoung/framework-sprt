package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 공모주 일정조회 조건 (AS-IS sch10_ipo.selectBySearchText 파라미터) — searchText·marketCode는 서버가 만든 LIKE 값 */
public record Sch10IpoUserCond(Long companyId, String dateType, LocalDate startDate, LocalDate closeDate, String searchText, String marketCode,
                               boolean interestYn) {
}
