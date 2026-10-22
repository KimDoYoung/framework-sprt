package kr.co.kfs.asseterp.biz.ics.dto;

/** 사유 창을 처음 열 때 답변 없이 작성 행을 만든다 (AS-IS Ics15_ChecklistWrite.modelUpdate, checklistWriteId 없음) — yyyymm은 'yyyy.MM' */
public record IcsChecklistWriteCreateReq(Long checklistId, String yyyymm, String cycleType) {
}
