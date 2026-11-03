package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr01_appr.selectByText(searchText01~03 가지) 조건 (A40 Apr01_Tab_ExternalBiz). titleLike는 서비스가 만든 "제목%" */
public record AprTitleSearchCond(Long companyId, Long regEmpId, LocalDate startDate, LocalDate endDate, String titleLike) {
}
