package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys30_LeaveYearModel — 근속연수별 연차개수. year·leaveDays는 AS-IS 모델처럼 문자열(DB numeric) */
public record LeaveYearRes(Long leaveYearId, Long companyId, String year, String leaveDays) {
}
