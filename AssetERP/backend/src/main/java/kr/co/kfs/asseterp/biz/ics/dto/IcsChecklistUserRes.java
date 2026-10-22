package kr.co.kfs.asseterp.biz.ics.dto;

/** 내부통제 체크리스트 한 행 — 고객사용 (AS-IS Ics10_ChecklistModel, ics10_checklist.selectBySearchText). useYn은 고객사별 설정(ics11)이 우선, writeGroupName은 담당(작성)그룹 */
public record IcsChecklistUserRes(Long checklistId, Long companyId, String content, String criterion, String useYn, Long checklistMClassId, Long seq,
                                  String checkLClassName, String checkMClassName, Long checkLClassId, String writeGroupName) {
}
