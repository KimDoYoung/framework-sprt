package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 포상휴가 한 행 (AS-IS Emp22_EtcLeaveModel — Emp22_Tab_EtcLeave 그리드) */
public record EtcLeaveManageRes(
        Long etcLeaveId,
        Long companyId,
        String leaveCode,
        String reason,
        Long days,
        LocalDate startDate,
        LocalDate closeDate,
        String note,
        Long apprId,
        String apprStatusCode,
        String apprStatusName) {
}
