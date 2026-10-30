package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 지출결의 등록·제거 (AS-IS Emp17_Benefit.updatePayRequestYm) — payRequestYyyymm이 null이면 제거 */
public record BenefitPayRequestYmReq(List<Long> benefitIds, String payRequestYyyymm) {
}
