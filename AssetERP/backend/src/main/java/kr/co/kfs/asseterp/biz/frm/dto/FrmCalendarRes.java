package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/** AS-IS frm01_list.selectCalendar 한 행 (Frm01_ListModel date·todoTitle·title) — 날짜별 업무구분 건수 */
public record FrmCalendarRes(
        LocalDate date,
        String todoTitle,
        String title
) {
}
