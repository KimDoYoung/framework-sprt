package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y02 휴가신청조회 그리드 한 행 (AS-IS Emp20_LeaveModel 중 Emp20_Tab_LeaveList가 쓰는 열) */
public record LeaveListRes(
        Long leaveId,
        LocalDate startDate,
        LocalDate closeDate,
        String personName,
        Double leaveCount,
        String leaveName,
        Long apprId,
        String managerName,
        String emergencyTelno
) {
}
