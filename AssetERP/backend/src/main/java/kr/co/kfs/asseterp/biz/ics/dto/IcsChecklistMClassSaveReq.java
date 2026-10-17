package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 중분류 저장 (AS-IS Ics23_ChecklistMClass.update): id가 없거나 0 이하면 새로 등록(대분류 ID 필요, 회사는 서버가 로그인 회사로) */
public record IcsChecklistMClassSaveReq(Long checklistMClassId, Long checklistLClassId, String checklistMClassName, String note, Long seq, String useYn, LocalDate closeDate) {
}
