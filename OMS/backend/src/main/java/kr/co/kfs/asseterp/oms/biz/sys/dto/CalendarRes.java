package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/**
 * 일자 (AS-IS Sys12_CalendarModel, sys12_calendar)
 *
 * @param workingYn 영업일 (sys12_working_yn = 'true')
 * @param companyNm 고객사반영(selectByDay)에서만 값이 있다
 */
public record CalendarRes(Long calendarId, Long companyId, String companyNm, LocalDate day, String weekday,
                          boolean workingYn, String offReason, String note) {
}
