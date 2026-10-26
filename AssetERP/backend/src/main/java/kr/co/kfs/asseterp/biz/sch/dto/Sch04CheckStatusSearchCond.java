package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** sch04_list.selectCheckListStatus 조건 (O06 업무일정 체크내역). statusCode·searchText는 LIKE 패턴(전체 '%'), classId는 전체면 null */
public record Sch04CheckStatusSearchCond(Long companyId, Long personId, LocalDate startDate, LocalDate endDate, String statusCode, Long classId, String searchText) {
}
