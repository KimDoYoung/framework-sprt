package kr.co.kfs.asseterp.biz.emp.dto;

/** 그리드에서 고친 제외사원 (AS-IS Emp28_JointLeaveExcept.update). jointLeaveExceptId 0 이하는 새 행 */
public record JointLeaveExceptSaveReq(Long jointLeaveExceptId, Long jointLeaveId, Long personId, String reason) {
}
