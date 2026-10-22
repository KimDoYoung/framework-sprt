package kr.co.kfs.asseterp.biz.ics.dto;

/** 예·아니오·해당없음 체크 (AS-IS ics.Ics15_ChecklistWrite.updateAnswerCode) — yyyymm은 'yyyy.MM' */
public record IcsChecklistWriteAnswerReq(Long checklistId, String answerCode, String yyyymm, String cycleType) {
}
