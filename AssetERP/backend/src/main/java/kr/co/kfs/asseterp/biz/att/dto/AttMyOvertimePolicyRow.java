package kr.co.kfs.asseterp.biz.att.dto;

/** att01_work_policy 한 행 중 연장근무 창이 쓰는 두 시각 (AS-IS Att01_WorkPolicyModel.getWorkEndTime·getPmWorkEndTime) */
public record AttMyOvertimePolicyRow(String workEndTime, String pmWorkEndTime) {
}
