package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * 내부통제내역 상세 한 행 (K07 상세 조회창·K08, AS-IS Ics11_ChecklistCompanyModel).
 * 행 키는 (checklistId, personId) — 작성 행이 아직 없을 수 있다(checklistWriteId null). reason은 "답변 (사유)"
 */
public record IcsChecklistStatusDetailRes(Long checklistId, Long companyId, String content, String criterion, Long seq,
                                          Long checklistMClassId, Long checkLClassId, String checkLClassName, String checkMClassName,
                                          Long checklistWriteId, String reason, String orgName, Long personId, String personName,
                                          Boolean fixYn, String confirmerName, Boolean confirmYn) {
}
