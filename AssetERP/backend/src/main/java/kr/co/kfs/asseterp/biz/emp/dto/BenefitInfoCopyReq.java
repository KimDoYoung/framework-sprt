package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 기초데이터생성 — 고른 복리후생비 설정(benefitInfoIds)을 고객사(companyIds) 각각으로 복사 */
public record BenefitInfoCopyReq(List<Long> companyIds, List<Long> benefitInfoIds) {
}
