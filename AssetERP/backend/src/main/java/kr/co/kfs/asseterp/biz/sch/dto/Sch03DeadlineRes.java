package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 기한 한 행 (AS-IS Sch03_DeadlineModel 중 Sch03_Lookup_Ics 그리드 열 + 수정 창이 읽는 코드·숫자·날짜, E01-1) */
public record Sch03DeadlineRes(Long deadlineId, Long infoId, Long companyId, String scheduleCode, String cycleCode, String cycleName,
                               String cycleCalcType, String periodCode, String yearCode, String yearTypeCode, String monthCode,
                               String monthTypeCode, String dayCode, String dayTypeCode, String weekCode, String dayWeekCode,
                               String holidayCode, Long num1, Long num2, Long num3, LocalDate fixDate, String note,
                               LocalDate startDate, LocalDate closeDate, String deadlineFullName) {
}
