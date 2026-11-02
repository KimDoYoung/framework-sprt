package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 일일업무 저장 — dailyId가 없으면 새 글 (AS-IS Rpt01_Daily.modelUpdate) */
public record DailySaveReq(
        Long dailyId,
        LocalDate date,
        String content,
        String note
) {
}
