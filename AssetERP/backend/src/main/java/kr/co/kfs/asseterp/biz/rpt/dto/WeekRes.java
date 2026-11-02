package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 주간업무보고 그리드 행 (AS-IS Rpt03_WeekModel, rpt03_week.selectByStartDate·selectById) */
public record WeekRes(
        Long weekId,
        Long personId,
        LocalDate weekStartDate,
        LocalDate weekCloseDate,
        String bizType,
        String bizTypeName,
        String content,
        String htmlContent,
        String dueDate,
        Long seq,
        Boolean bold,
        String note,
        Boolean fixYn,
        String fixYnStr,
        String orgName,
        String personName
) {
}
