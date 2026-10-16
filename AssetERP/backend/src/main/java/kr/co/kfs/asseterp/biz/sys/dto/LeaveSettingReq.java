package kr.co.kfs.asseterp.biz.sys.dto;

/** 휴가초과허용여부·휴가결산월 저장 (회사는 로그인 회사) */
public record LeaveSettingReq(String leaveYn, String leaveMonthCode) {
}
