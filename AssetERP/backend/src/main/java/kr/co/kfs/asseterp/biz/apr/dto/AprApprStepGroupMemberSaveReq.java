package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선 지정그룹 멤버 저장 한 행 (AS-IS Apr31_ApprStepGroupMember.update). 요청 순서가 결재 순서(seq 001~)다. id가 없거나 0 이하면 새 행 */
public record AprApprStepGroupMemberSaveReq(Long apprStepGroupMemberId, String stepTypeCode, Long stepEmpId, String note) {
}
