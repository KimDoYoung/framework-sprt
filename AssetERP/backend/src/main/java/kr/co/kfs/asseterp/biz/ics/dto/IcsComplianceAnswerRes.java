package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** Ics33_TabPage_ComplianceAnswer 그리드 (AS-IS ics33_compliance_answer.selectByCompanyId) */
public record IcsComplianceAnswerRes(Long complianceAnswerId, Long companyId, LocalDate startDate, String complianceType, Long caseNo,
                                     String answer1Cd, String answer1Name, String answer2Cd, String answer2Name, String answer3Cd, String answer3Name,
                                     String answer4Cd, String answer4Name, String answer5Cd, String answer5Name) {
}
