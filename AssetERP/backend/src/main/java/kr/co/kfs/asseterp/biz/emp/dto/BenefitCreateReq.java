package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 복리후생비 신청 등록 (AS-IS Emp17_Lookup_Benefit.update 의 Emp17_BenefitModel, 호출 Emp17_Tab_Benefit [등록]) — 신청자·회사·신청일은 서버가 정한다 */
public record BenefitCreateReq(String benefitCode, Long issueAmt, LocalDate occDate, String benefitDetail, Long dcrClassTreeId) {
}
