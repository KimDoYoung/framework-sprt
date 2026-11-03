package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선 지정그룹 멤버 한 행 (AS-IS Apr31_ApprStepGroupMemberModel — Apr31_Page_ApprStepGroupMember 그리드). titleName은 원본 SQL에 열이 없어 항상 비어 있다 */
public record AprApprStepGroupMemberRes(Long apprStepGroupMemberId, Long apprStepGroupId, String stepTypeCode, String stepTypeName,
                                        String orgName, String titleName, String empKorName, Long stepEmpId, String seq, String note) {
}
