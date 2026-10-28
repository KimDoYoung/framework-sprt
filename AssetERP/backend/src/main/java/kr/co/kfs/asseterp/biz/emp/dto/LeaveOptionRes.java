package kr.co.kfs.asseterp.biz.emp.dto;

/** 로그인 회사의 휴가 설정 (AS-IS LoginUser.getCompanyModel().getLeaveYn/getLeaveConfirmYn/getLeaveMonthCode) */
public record LeaveOptionRes(Boolean leaveYn, Boolean leaveConfirmYn, String leaveMonthCode) {
}
