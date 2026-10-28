package kr.co.kfs.asseterp.biz.sys.dto;

public record LeaveCompanySaveReq(
        Long leaveCompanyId,
        String leaveCode,
        String spcLeaveCode,
        Long days,
        String calcCode,
        Boolean unUseYn,
        String note
) {
}
