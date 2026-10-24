package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인자 한 행 (AS-IS tdm09_appr_step.selectByParentId, Tdm09_ApprStepModel 중 오른쪽 그리드 속성) */
public record ApprStepChildRes(
        Long apprStepId,
        String apprSeq,
        Long apprEmpId,
        String apprStepInfo,
        String apprEmpName,
        String posName,
        String apprOrgName) {
}
