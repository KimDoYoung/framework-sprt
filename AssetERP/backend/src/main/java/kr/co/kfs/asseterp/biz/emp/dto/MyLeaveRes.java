package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y01 휴가신청 그리드·편집창 한 행 (AS-IS Emp20_LeaveModel — Emp20_Tab_Leave/Emp20_Edit_Leave가 쓰는 열) */
public record MyLeaveRes(
        Long leaveId,
        Long personId,
        String leaveCode,
        String leaveName,
        String spcLeaveCode,
        String spcLeaveName,
        Long etcLeaveId,
        LocalDate regDate,
        LocalDate startDate,
        LocalDate closeDate,
        Double leaveCount,
        String reason,
        String managerName,
        String emergencyTelno,
        String note,
        Long apprId,
        String apprStatusCode,
        String apprStatusName,
        Long classTreeId,
        String classTreeFullName,
        String altPersonName,
        String cancel,
        String overConfirmStatusCode,
        String overConfirmStatusName,
        String overConfirmerName,
        String overConfirmDateStr
) {
}
