package kr.co.kfs.asseterp.biz.rpt.dto;

/** 월간회의자료 저장 — monthId가 없으면 새 글 (AS-IS Rpt02_Month.modelUpdate). yyyyMm = "yyyy.MM" */
public record MonthSaveReq(
        Long monthId,
        String yyyyMm,
        String content,
        String note
) {
}
