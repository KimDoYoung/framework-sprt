package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 대분류 저장 (AS-IS Ics21_ChecklistLClass.update): id가 없거나 0 이하면 새로 등록(회사는 서버가 로그인 회사로) */
public record IcsChecklistLClassSaveReq(Long checklistLClassId, String checklistLClassName, String note, Long seq, String useYn, LocalDate closeDate) {
}
