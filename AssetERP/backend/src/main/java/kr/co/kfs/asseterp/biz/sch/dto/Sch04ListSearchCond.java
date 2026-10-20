package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * sch04_list.selectByIcs 조건. startDateCalc·closeDateCalc는 서비스가 dbConfig.getBizDate(startDate '-1', closeDate '+1')로 채운다.
 * scheduleCode·cycleCode는 전체가 '%', searchText는 LIKE 패턴. orgId는 로그인 사용자의 조직(회사관리자는 0)
 */
public record Sch04ListSearchCond(Long companyId, Long personId, Long orgId, LocalDate startDate, LocalDate closeDate, LocalDate startDateCalc,
                                  LocalDate closeDateCalc, boolean doneExceptYn, String scheduleCode, String cycleCode, boolean managerYn,
                                  String searchText, boolean advisYn) {
}
