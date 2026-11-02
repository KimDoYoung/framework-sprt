package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** rpt03_week.selectByLastStartDate 한 줄 — sys99_print에 담을 지난주·이번주 비교 행 */
public record WeekPrintRow(
        String bizType,
        Long rdSeq,
        String bizTypeName,
        LocalDate lastWeekStartDate,
        String lastContent,
        String lastDueDate,
        Boolean lastBold,
        LocalDate weekStartDate,
        String content,
        String dueDate,
        Boolean bold
) {
}
