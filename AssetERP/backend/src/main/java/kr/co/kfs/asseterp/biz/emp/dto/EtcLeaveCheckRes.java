package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y01 포상휴가 확인 (AS-IS emp22_etc_leave.selectByEtcLeaveId — 사용일수는 이 휴가 신청을 뺀 값) */
public record EtcLeaveCheckRes(Long etcLeaveId, LocalDate startDate, LocalDate closeDate, Long days, Double useDays) {
}
