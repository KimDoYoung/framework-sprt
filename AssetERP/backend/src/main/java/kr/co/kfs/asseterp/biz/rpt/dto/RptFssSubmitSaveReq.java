package kr.co.kfs.asseterp.biz.rpt.dto;

/** 금감원 업무보고서 저장 (Rpt10_Edit_WriteGuide.update). submitId가 없거나 0 이하면 새 행 */
public record RptFssSubmitSaveReq(Long submitId, String reportCode, String reportName, String submitCycleCode,
                                  String writeTarget, String writeGuide, String reviseHistory) {
}
