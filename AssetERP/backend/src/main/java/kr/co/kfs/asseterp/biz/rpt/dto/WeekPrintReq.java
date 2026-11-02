package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 주간업무보고 [출력/다운로드] 조건 (AS-IS Sys99_Print.insertRdWeekWrite) */
public record WeekPrintReq(LocalDate startDate) {
}
