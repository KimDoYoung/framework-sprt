package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A46~A51 복리후생비 지출결의서 본문·연관문서에 쓰는 지출결의내역 한 줄 (AS-IS 화면의 payRequestGrid 행 Emp17_BenefitModel) */
public record BenefitPayLinkRow(Long benefitId, String personName, Long issueAmt, LocalDate occDate, String benefitDetail,
                                Long apprId, String apprTitleName, LocalDate apprRegDate, String apprInoutCode) {
}
