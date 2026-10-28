package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 공동연차 한 행 (AS-IS Emp24_JointLeaveModel — Emp24_Tab_JointLeave 위 그리드) */
public record JointLeaveRes(
        Long jointLeaveId,
        Long companyId,
        LocalDate startDate,
        LocalDate closeDate,
        String reason,
        String note,
        Long apprId,
        String apprStatusCode,
        String apprStatusName) {
}
