package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 그리드에서 고친 포상휴가 (AS-IS Emp22_EtcLeave.update). etcLeaveId 0 이하는 새 행 */
public record EtcLeaveManageSaveReq(Long etcLeaveId, String reason, Long days, LocalDate startDate, LocalDate closeDate, String note) {
}
