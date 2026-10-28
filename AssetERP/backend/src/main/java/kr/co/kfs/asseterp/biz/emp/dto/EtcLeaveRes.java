package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 포상휴가 내역 (AS-IS Emp22_EtcLeaveModel) */
public record EtcLeaveRes(
        Long etcLeaveId,
        String reason,
        LocalDate startDate,
        LocalDate closeDate,
        Long days,
        Double useDays,
        Double remainDays,
        String note
) {
}
