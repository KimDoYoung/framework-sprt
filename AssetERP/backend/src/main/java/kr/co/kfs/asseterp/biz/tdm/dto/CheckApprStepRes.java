package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인선 한 행 (AS-IS Tdm58_ChckApprStepModel — tdm58_chck_appr_step.selectByChckOrgId) */
public record CheckApprStepRes(Long chckApprStepId, Long chckOrgId, String apprSeq, Long apprEmpId,
                               String apprEmpName, Long apprOrgId, String apprOrgName, String apprStepInfo) {
}
