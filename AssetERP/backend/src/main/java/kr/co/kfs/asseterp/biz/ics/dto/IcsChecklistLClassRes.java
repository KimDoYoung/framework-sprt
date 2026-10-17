package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 체크리스트 대분류 한 행 (AS-IS Ics21_ChecklistLClassModel, E04). 사용여부·사용종료일은 고객사별 설정(ics22)이 있으면 그 값. useYn은 DB 형태 그대로 */
public record IcsChecklistLClassRes(Long checklistLClassId, String checklistLClassName, Long companyId, String note, Long seq, String useYn, LocalDate closeDate) {
}
