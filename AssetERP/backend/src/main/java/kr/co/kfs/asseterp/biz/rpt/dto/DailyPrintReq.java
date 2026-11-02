package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 일일업무 확인 [출력/다운로드] 조건 (AS-IS Sys99_Print.insertRdDaily) */
public record DailyPrintReq(LocalDate startDate, LocalDate closeDate, boolean unconfirmedOnly, String searchText) {
}
