package kr.co.kfs.asseterp.biz.emp.dto;

/** 그리드에서 고친 휴가 일수 (AS-IS Emp21_UnLeave.update 의 고치는 열) */
public record UnLeaveSaveReq(Long unLeaveId, Double totalDays, Double useDays, Double remainDays) {
}
