package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y02 [출력/다운로드] (AS-IS sys.Sys99_Print.insertRdLeaveList) */
public record LeaveListDownloadReq(String personName, LocalDate startDate, LocalDate closeDate) {
}
