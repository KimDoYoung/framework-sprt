package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** AS-IS emp22_etc_leave.getLeaveDate 한 줄 — 결재 완료된 특별휴가 기간 */
public record UnLeaveEtcRange(LocalDate startDate, LocalDate closeDate) {
}
