package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * sch04_list.selectByManagerId 조건 (O04 업무일정 처리). manageCheck(처리일 기준)·exceptYn(완료건 제외)·cancelYn(취소건 제외)은 'true'/'false' 글자,
 * shareType은 '1'(나의 스케줄), statusCode는 LIKE 패턴(전체 '%'), classId는 전체면 null, searchText는 LIKE 패턴
 */
public record Sch04TodoSearchCond(Long companyId, Long personId, Long orgId, String manageCheck, LocalDate startDate, LocalDate endDate,
                                  String shareType, String exceptYn, String cancelYn, String statusCode, Long classId, String searchText) {
}
