package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무구조도 제출 조회 SQL 파라미터 (AS-IS tdm36_role_report.selectByDate, N14). 일자는 yyyy-MM-dd */
public record RoleReportParam(Long companyId, String startDate, String closeDate, boolean notPeriodYn, boolean notEndYn) {
}
