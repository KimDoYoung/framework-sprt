package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys30_Grid_LeaveYear 저장 한 행 (leaveYearId ≤ 0·null이면 새 행) */
public record LeaveYearSaveReq(Long leaveYearId, String year, String leaveDays) {
}
