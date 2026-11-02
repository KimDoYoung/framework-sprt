package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 기준일이 속한 주 (AS-IS Rpt03_Week.getWeekDays) — 월요일~금요일 */
public record WeekDaysRes(int weekNumber, LocalDate startDate, LocalDate closeDate) {
}
