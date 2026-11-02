package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 일일업무 그리드 행 (AS-IS Rpt01_DailyModel, rpt01_daily.selectByText·selectById) */
public record DailyRes(
        Long dailyId,
        LocalDate date,
        String content,
        String note,
        Long personId,
        Boolean confirmYn,
        String confirmYnName,
        String confirmName
) {
}
