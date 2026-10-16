package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys30_Tab_LeaveYear 왼쪽 그리드 한 행 (Sys01_CompanyModel 중 휴가 열). leaveYn 'true'/'false'(DB 그대로, 없으면 null) */
public record LeaveSettingRes(Long companyId, String leaveYn, String leaveMonthCode, String leaveMonthName) {
}
