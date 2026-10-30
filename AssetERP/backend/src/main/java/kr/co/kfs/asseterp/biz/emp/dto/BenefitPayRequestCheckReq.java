package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** [지출결의등록] 사전 검사 (AS-IS Emp17_Benefit.payRequestApprCheck) — 고른 신청 행과 기준년월 */
public record BenefitPayRequestCheckReq(String year, String month, List<Long> benefitIds) {
}
