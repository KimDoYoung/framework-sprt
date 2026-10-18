package kr.co.kfs.asseterp.biz.rpt.dto;

/** 금감원 업무보고서 (AS-IS Rpt10_FssSubmitModel — Rpt10_Tab_FssSubmit 그리드, Rpt10_Edit_WriteGuide) */
public record RptFssSubmitRes(Long submitId, String reportCode, String reportName, String submitCycleCode, String submitCycleName,
                              String writeTarget, String writeGuide, String reviseHistory) {
}
