package kr.co.kfs.asseterp.biz.apr.dto;

/** 문서분류에 지정된 결재선 그룹의 사원 (apr31_appr_step_group_member, V06) */
public record AprGroupMemberRow(Long personId, String stepTypeCode, String stepTypeName, Long orgCodeId, String titleName, String korName, String orgTitleName) {
}
