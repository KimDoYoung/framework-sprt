package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 직전 보고내용 가져오기 (AS-IS Rpt03_Week.insertBeforeWeek) */
public record WeekCopyReq(LocalDate startDate, LocalDate closeDate, LocalDate beforeStartDate) {
}
