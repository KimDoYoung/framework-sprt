package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인요청이 승인자 순서대로 도는 승인선 (AS-IS tdm58_chck_appr_step.selectApprStep — 승인자 부서와 다음 승인자 부서) */
public record CheckApprStepOrgRes(Long apprOrgId, Long parentOrgId) {
}
