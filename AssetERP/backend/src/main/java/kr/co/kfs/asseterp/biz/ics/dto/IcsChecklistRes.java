package kr.co.kfs.asseterp.biz.ics.dto;

/** 내부통제 체크리스트 한 행 (AS-IS Ics10_ChecklistModel 중 Ics10_Tab_ChecklistAdmin 그리드 열 + 편집 창 값, E04). useYn은 DB 형태('true'/'false') 그대로 */
public record IcsChecklistRes(Long checklistId, Long companyId, String content, String criterion, String useYn, Long checklistMClassId, Long seq,
                              String checkLClassName, String checkMClassName, Long checkLClassId, Long checkLClassSeq, Long checkMClassSeq) {
}
