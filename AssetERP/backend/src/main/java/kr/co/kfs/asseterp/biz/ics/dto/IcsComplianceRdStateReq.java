package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** #1311 [상신]의 RD 출력 자료 만들기 (AS-IS sys.Sys99_Print.insertComplianceState, confirmerId = 로그인 사원) — stdDate = 기준 분기(월)의 말일 */
public record IcsComplianceRdStateReq(LocalDate stdDate, String cycleType) {
}
