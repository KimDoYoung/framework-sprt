package kr.co.kfs.asseterp.biz.apr.dto;

/** 상신자 조직에서 위로 올라가며 찾은 조직장 (apr04_appr_step.selectApprStepByType, V06) */
public record AprOrgHeadRow(Long personId, Long orgCodeId) {
}
