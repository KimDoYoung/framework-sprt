package kr.co.kfs.asseterp.biz.ics.dto;

/** 작성 행 하나 (AS-IS Ics15_ChecklistWriteModel — 그리드 행의 checklistWriteModel) */
public record IcsChecklistWriteItem(Long checklistWriteId, Long checklistId, String answerCode, String reason, Boolean fixYn, Boolean confirmYn) {
}
