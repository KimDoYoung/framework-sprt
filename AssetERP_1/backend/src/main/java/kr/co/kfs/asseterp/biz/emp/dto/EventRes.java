package kr.co.kfs.asseterp.biz.emp.dto;

/** 행사내역 행 (AS-IS Emp12_EventModel) */
public record EventRes(
        Long eventId,
        Long personId,
        String eventDt,
        String eventNm,
        String eventPart,
        String eventDesc,
        String note
) {}
