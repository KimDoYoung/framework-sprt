package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** 근태정책 한 행 (AS-IS Att01_WorkPolicyModel, Att01_Lookup_WorkPolicy 그리드) */
public record AttWorkPolicyRes(Long workPolicyId, LocalDate startDate, String workStartTime, String workEndTime, Long breakMinutes,
                               Boolean useYn, Long overtimeMinutes, Long startGraceAfterMinutes, Long endGraceBeforeMinutes,
                               Long endGraceAfterMinutes, String pmWorkStartTime, String pmWorkEndTime) {
}
