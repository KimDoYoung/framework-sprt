package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선 지정그룹 저장 한 행 (AS-IS Apr30_ApprStepGroup.update). apprStepGroupId가 없거나 0 이하면 새 행, 회사는 서버가 세션에서 */
public record AprApprStepGroupSaveReq(Long apprStepGroupId, String apprStepGroupName, String note) {
}
