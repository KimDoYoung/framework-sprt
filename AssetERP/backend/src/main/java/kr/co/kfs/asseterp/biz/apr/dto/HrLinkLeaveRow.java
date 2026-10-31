package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A01 휴가신청 한 건 (AS-IS Emp20_LeaveModel 중 양식에 쓰는 값, V24) */
public record HrLinkLeaveRow(String leaveCode, String leaveName, LocalDate startDate, LocalDate closeDate, Double leaveCount, String spcLeaveName,
                             String reason, String altPersonName, String managerName, String emergencyTelno) {
}
