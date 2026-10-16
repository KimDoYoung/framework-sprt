package kr.co.kfs.asseterp.biz.sys.dto;

/** 일자 저장 행 — 화면이 바꾸는 컬럼(영업일·휴일사유·비고)만. 고객사반영(관리자)은 note를 쓰지 않는다 */
public record CalendarSaveReq(Long calendarId, String workingYn, String offReason, String note) {
}
