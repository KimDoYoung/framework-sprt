package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 미사용 연차·월차 휴가 한 행 (AS-IS Emp21_UnLeaveModel — Emp21_TabPage_UnLeaveList1·2 그리드) */
public record UnLeaveRes(
        Long unLeaveId,
        Long personId,
        String unLeaveCode,
        String unLeaveName,
        String personNo,
        String personName,
        LocalDate hireDate,
        Double totalDays,
        Double useDays,
        Double remainDays,
        LocalDate startDate,
        Long apprId,
        String apprStatusCode,
        String apprStatusName,
        Long expectApprId,
        String expectApprStatusCode,
        String expectApprStatusName) {
}
