package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 체크리스트 상신 결과 기록 (AS-IS ics.Ics16_RelateAppr.updateApprId) — stdDate = 기준 분기(월)의 말일, lastApprId = 폐기할 이전 상신 문서 */
public record IcsChecklistRelateApprIdReq(LocalDate stdDate, String cycleType, Long checklistLClassId, Long apprId, Long lastApprId) {
}
