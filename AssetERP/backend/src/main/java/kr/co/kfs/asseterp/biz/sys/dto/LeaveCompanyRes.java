package kr.co.kfs.asseterp.biz.sys.dto;

/** 고객사별 휴가기준관리 한 행 (AS-IS Sys31_LeaveCompanyModel). 저장된 행이 없는 기준은 임시 번호(ROW_NUMBER)가 ID로 온다 */
public record LeaveCompanyRes(
        Long leaveCompanyId,
        String leaveCode,
        String leaveName,
        String spcLeaveCode,
        String spcLeaveName,
        Long days,
        String calcCode,
        String calcName,
        Boolean unUseYn,
        String note
) {
}
