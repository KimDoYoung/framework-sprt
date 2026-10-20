package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** AS-IS apr01_appr.selectByAuthEmpId 조건 (G04 Apr01_Tab_MyAuthList). status '%'가 전체, searchText는 %…% (완료·반려만 보는 조건은 SQL 고정) */
public record AprMyAuthCond(Long companyId, Long regEmpId, LocalDate startDate, LocalDate closeDate, String status,
                            String searchText, Long classTreeId, String typeCode) {
}
