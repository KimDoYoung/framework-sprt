package kr.co.kfs.asseterp.biz.rpt.dto;

/** 월간회의자료 그리드 행 (AS-IS Rpt02_MonthModel, rpt02_month.selectByText·selectById) */
public record MonthRes(
        Long monthId,
        Long personId,
        String orgName,
        String yyyyMm,
        String content,
        String note,
        Long fileCount
) {
}
