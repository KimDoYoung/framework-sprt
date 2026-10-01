package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 일자 저장 행 (AS-IS UpdateDataModel(sys12_calendar) 중 화면에서 바꾸는 영업일·휴일사유·비고) */
public record CalendarSaveReq(Long calendarId, boolean workingYn, String offReason, String note) {
}
