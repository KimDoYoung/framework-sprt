package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 휴가관리 그리드 한 행 (AS-IS Emp20_LeaveModel 중 Emp20_Tab_LeaveManager가 쓰는 열) */
public record LeaveRes(
        Long leaveId,
        Long personId,
        Long apprId,
        LocalDate startDate,
        LocalDate closeDate,
        String leaveName,
        Double leaveCount,
        String managerName,
        String reason,
        String apprStatusCode,
        String apprStatusName,
        String overConfirmStatusCode,
        String overConfirmStatusName,
        String overConfirmerName,
        String overConfirmDateStr
) {
}
