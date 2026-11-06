package kr.co.kfs.asseterp.biz.frm.dto;

/** MyPage 일정 박스 자리비움 한 행 (AS-IS Emp20_LeaveModel — emp20_leave.selectByDate, buildGrid04 L292-295) */
public record FrmRelateLeaveRes(
        Long rowId,
        Long leaveId,
        String leaveCode,
        String personName,
        String leaveName,
        String stdPeriod
) {
}
