package kr.co.kfs.asseterp.biz.ics.dto;

/** Ics10_Edit_Checklist 저장 (AS-IS Ics10_Checklist.modelUpdate): 회사는 서버가 로그인 회사로 채운다. checklistId는 창을 열 때 받은 새 id(next-id) 또는 기존 id */
public record IcsChecklistSaveReq(Long checklistId, String content, String criterion, String useYn, Long checklistMClassId, Long seq) {
}
