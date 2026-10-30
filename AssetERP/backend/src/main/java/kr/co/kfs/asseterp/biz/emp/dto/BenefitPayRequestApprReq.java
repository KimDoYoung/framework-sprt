package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 지출결의서 상신 뒤 상신ID 기록 (AS-IS Emp17_Benefit.updatePayRequestApprId) */
public record BenefitPayRequestApprReq(List<Long> benefitIds, Long apprId) {
}
