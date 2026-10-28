package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 그리드에서 고친 공동연차 (AS-IS Emp24_JointLeave.update 의 고치는 열). jointLeaveId 0 이하는 새 행 */
public record JointLeaveSaveReq(Long jointLeaveId, LocalDate startDate, LocalDate closeDate, String reason) {
}
