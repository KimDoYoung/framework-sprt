package kr.co.kfs.asseterp.biz.tdm.dto;

/** 직책-부서 저장 한 행 — apprStepId ≤ 0이면 INSERT (AS-IS Tdm09_ApprStep.update, UpdateDataModel) */
public record ApprStepSaveReq(
        Long apprStepId,
        Long roleId,
        Long orgId) {
}
