package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 출장 한 행 (AS-IS Emp53_BizTripModel — Emp53_Tab_BizTripManager 그리드) */
public record BizTripRes(
        Long bizTripId,
        String personInfo,
        LocalDate startDate,
        LocalDate closeDate,
        String bizTripName,
        String destination,
        String purpose,
        String num,
        String companion,
        Long apprId,
        String apprStatusCode,
        String apprStatusName,
        Long resultApprId,
        String resultApprStatusCode,
        String resultApprStatusName,
        Boolean resultSkipYn,
        String skipReason) {
}
