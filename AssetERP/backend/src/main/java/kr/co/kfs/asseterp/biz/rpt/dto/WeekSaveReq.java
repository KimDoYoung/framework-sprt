package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 주간업무보고 저장 — weekId가 없으면 새 글 (AS-IS Rpt03_Week.modelUpsert / UpdateDataModel). 건의사항(999) 그리드는 bizType 없이 보낸다 */
public record WeekSaveReq(
        Long weekId,
        LocalDate weekStartDate,
        LocalDate weekCloseDate,
        String bizType,
        String content,
        String dueDate,
        Long seq,
        Boolean bold,
        String note
) {
}
