package kr.co.kfs.asseterp.biz.emp.dto;

/** 초기설정 휴가일수 (AS-IS Emp26_InitLeaveModel) */
public record InitLeaveRes(
        Long initLeaveId,
        Long personId,
        String year,
        String personNo,
        String personName,
        String posName,
        Double useDays
) {
}
