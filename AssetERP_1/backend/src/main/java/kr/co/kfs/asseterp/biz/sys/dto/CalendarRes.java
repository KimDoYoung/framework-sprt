package kr.co.kfs.asseterp.biz.sys.dto;

/** 일자 한 행 (AS-IS Sys12_CalendarModel). day는 'YYYY-MM-DD', workingYn은 'true'/'false'(영업일 체크박스), companyName은 고객사반영 조회창에서만 */
public record CalendarRes(Long calendarId, Long companyId, String companyName, String day, String weekday, String workingYn, String offReason, String note) {
}
