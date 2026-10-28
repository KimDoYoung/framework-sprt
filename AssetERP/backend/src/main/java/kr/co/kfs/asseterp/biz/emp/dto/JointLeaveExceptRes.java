package kr.co.kfs.asseterp.biz.emp.dto;

/** 공동연차 제외사원 한 행 (AS-IS Emp28_JointLeaveExceptModel — Emp24_Tab_JointLeave 아래 그리드) */
public record JointLeaveExceptRes(
        Long jointLeaveExceptId,
        Long jointLeaveId,
        Long personId,
        String orgName,
        String personName,
        String reason) {
}
