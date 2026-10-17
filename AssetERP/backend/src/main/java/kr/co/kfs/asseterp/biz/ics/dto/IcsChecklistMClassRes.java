package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 체크리스트 중분류 한 행 (AS-IS Ics23_ChecklistMClassModel, E04) */
public record IcsChecklistMClassRes(Long checklistMClassId, String checklistMClassName, Long checklistLClassId, Long companyId, String note, Long seq,
                                    String useYn, LocalDate closeDate) {
}
