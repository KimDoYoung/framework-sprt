package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/**
 * sys12_calendar 조회·생성·수정 파라미터 (AS-IS 파라미터 Map)
 *
 * @param companyId null이면 회사 조건 없음 (고객사반영: KFS 관리자)
 * @param month     '%'면 전체
 */
public record CalendarParam(Long companyId, String year, String month, LocalDate day,
                            Long calendarId, String workingYn, String offReason, String note) {

    public static CalendarParam ofYear(Long companyId, String year, String month) {
        return new CalendarParam(companyId, year, month == null || month.isBlank() ? "%" : month, null, null, null, null, null);
    }

    public static CalendarParam ofSave(Long companyId, CalendarSaveReq req) {
        return new CalendarParam(companyId, null, null, null, req.calendarId(), String.valueOf(req.workingYn()), req.offReason(), req.note());
    }
}
