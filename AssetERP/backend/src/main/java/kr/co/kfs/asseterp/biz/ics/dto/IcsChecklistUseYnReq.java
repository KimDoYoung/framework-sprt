package kr.co.kfs.asseterp.biz.ics.dto;

/** 고객사별 사용여부 한 건 (AS-IS Ics11_ChecklistCompany.updateUseYn의 Ics10_ChecklistModel 목록) */
public record IcsChecklistUseYnReq(Long checklistId, String useYn) {
}
