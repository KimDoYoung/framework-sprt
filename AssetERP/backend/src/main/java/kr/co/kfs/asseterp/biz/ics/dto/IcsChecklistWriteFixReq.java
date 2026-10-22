package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** 제출(true)·제출취소(false) (AS-IS ics.Ics15_ChecklistWrite.updateFixYn) — 그리드 행들의 checklistWriteId */
public record IcsChecklistWriteFixReq(Boolean fixYn, List<Long> writeIds) {
}
