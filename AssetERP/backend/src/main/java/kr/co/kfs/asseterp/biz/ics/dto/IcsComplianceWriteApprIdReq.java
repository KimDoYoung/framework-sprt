package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** #1310 상신 기록 (AS-IS ics.Ics32_RelateAppr.insertApprId, A53) — stdDate = 기준 분기(월)의 말일 */
public record IcsComplianceWriteApprIdReq(LocalDate stdDate, String cycleType, Long apprId) {
}
