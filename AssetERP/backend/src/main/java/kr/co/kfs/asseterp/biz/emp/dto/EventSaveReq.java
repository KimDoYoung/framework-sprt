package kr.co.kfs.asseterp.biz.emp.dto;

/** 행사내역 저장 요청 */
public record EventSaveReq(
        Long eventId,
        Long personId,
        String eventDt,
        String eventNm,
        String eventPart,
        String eventDesc,
        String note
) {}
