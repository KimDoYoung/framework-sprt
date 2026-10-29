package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** 근태정책 저장 한 행 — workPolicyId가 null·0 이하이면 신규(AS-IS UpdateDataModel) */
public record AttWorkPolicySaveReq(Long workPolicyId, LocalDate startDate, String workStartTime, String workEndTime, Long breakMinutes,
                                   Boolean useYn, Long overtimeMinutes, Long startGraceAfterMinutes, Long endGraceBeforeMinutes,
                                   Long endGraceAfterMinutes, String pmWorkStartTime, String pmWorkEndTime) {
}
