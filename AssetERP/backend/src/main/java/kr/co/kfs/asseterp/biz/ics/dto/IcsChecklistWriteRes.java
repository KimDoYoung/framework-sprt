package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * Ics15_Tab_ChecklistWrite 그리드 한 행 (AS-IS ics10_checklist.selectByPersonId → Ics10_ChecklistModel).
 * 작성 행이 없으면 checklistWriteId·answerCode·reason이 비어 있다(LEFT JOIN). 앞쪽 열은 보기 창(Ics10_Edit_Checklist)이 쓰는 체크리스트 값
 */
public record IcsChecklistWriteRes(Long checklistId, Long companyId, String content, String criterion, Long seq,
                                   Long checklistMClassId, Long checkLClassId, String checkLClassName, String checkMClassName,
                                   Long checklistWriteId, String answerCode, String reason, Boolean fixYn, Boolean confirmYn) {
}
