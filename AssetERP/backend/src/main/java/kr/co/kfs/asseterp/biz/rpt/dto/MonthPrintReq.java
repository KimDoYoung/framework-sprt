package kr.co.kfs.asseterp.biz.rpt.dto;

/** 월간회의자료 [출력/다운로드] 조건 (AS-IS Sys99_Print.insertRdMonth). yyyyMm = "yyyy.MM" 또는 "yyyy.%" */
public record MonthPrintReq(String yyyyMm, Long orgCodeId, String searchText) {
}
