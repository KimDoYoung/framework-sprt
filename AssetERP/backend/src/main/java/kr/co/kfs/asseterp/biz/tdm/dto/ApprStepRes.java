package kr.co.kfs.asseterp.biz.tdm.dto;

/** 직책-부서 승인선 한 행 (AS-IS tdm09_appr_step.selectByCompanyId, Tdm09_ApprStepModel 중 왼쪽 그리드 속성). 저장 응답은 이름이 null */
public record ApprStepRes(
        Long apprStepId,
        Long roleId,
        Long orgId,
        String roleName,
        String exctName,
        String orgName,
        String managerName) {
}
