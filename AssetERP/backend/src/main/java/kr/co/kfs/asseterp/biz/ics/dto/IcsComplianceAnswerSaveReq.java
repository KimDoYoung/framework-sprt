package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics33_TabPage_ComplianceAnswer 저장 (AS-IS ics.Ics33_ComplianceAnswer.update): complianceAnswerId ≤ 0 이면 새 행. 회사는 서버가 채운다 */
public record IcsComplianceAnswerSaveReq(Long complianceAnswerId, LocalDate startDate, String complianceType, Long caseNo,
                                         String answer1Cd, String answer2Cd, String answer3Cd, String answer4Cd, String answer5Cd) {
}
