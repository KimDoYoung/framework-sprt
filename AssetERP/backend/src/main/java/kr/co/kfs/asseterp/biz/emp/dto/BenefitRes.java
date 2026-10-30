package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/**
 * 복리후생비 신청 한 행 (AS-IS emp17_benefit.selectByText / selectByBenefitCode — Emp17_BenefitModel).
 * benefitYn은 DB 형태('true'/'false'/null) 그대로이고, 화면의 지급여부(benefitYnStr)는 화면이 만든다
 */
public record BenefitRes(Long benefitId, Long companyId, LocalDate issueDate, String benefitCode, String benefitName,
                         Long personId, String personName, Long apprId, String apprTitleName, Long issueAmt,
                         LocalDate occDate, String benefitDetail, String note, String benefitYn,
                         String apprStatusCode, String apprStatusName, String payRequestYyyymm, String accountName) {
}
