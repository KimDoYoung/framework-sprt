package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 외출 한 행 (AS-IS Emp54_ErrandModel — Emp54_Tab_ErrandManager 그리드) */
public record ErrandRes(
        Long errandId,
        LocalDate date,
        String weekday,
        String personInfo,
        String errandName,
        String departTime,
        String returnTime,
        String reason,
        String venue,
        String host,
        String note,
        Long apprId,
        String aprStatusName) {
}
