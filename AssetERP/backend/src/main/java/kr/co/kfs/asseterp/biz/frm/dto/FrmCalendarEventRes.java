package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/**
 * MyPage 달력 일정 하나 (AS-IS JsonCalendar.getJson L64-152이 fullcalendar에 주던 JSON: title·start·end·color·textColor).
 * title = 달력에 보이는 글(todoTitle, 예 "나의일정(0/4)"·"부서일정3건"), kind = 업무구분 이름(색 명도 계산·일정 박스 탭 고르기에 쓴다)
 */
public record FrmCalendarEventRes(
        LocalDate date,
        String title,
        String kind,
        String color,
        String textColor
) {
}
