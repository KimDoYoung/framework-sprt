package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인선 저장 행 (ID가 0 이하면 새 행) */
public record CheckApprStepRow(Long chckApprStepId, Long chckOrgId, String apprSeq, Long apprEmpId) {
}
