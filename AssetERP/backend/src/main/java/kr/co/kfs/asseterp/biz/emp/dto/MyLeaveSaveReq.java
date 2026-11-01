package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y01 휴가신청 저장 (AS-IS Emp20_Leave.update — leaveId 0 이하는 신규) */
public record MyLeaveSaveReq(
        Long leaveId,
        String leaveCode,
        String spcLeaveCode,
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
        Long classTreeId
) {
}
