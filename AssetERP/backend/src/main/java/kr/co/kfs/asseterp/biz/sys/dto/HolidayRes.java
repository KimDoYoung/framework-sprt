package kr.co.kfs.asseterp.biz.sys.dto;

/** 휴일 한 행 (AS-IS Sys14_HolidayModel). day는 'YYYY-MM-DD' */
public record HolidayRes(Long holidayId, Long companyId, String day, String holidayName, String note) {
}
