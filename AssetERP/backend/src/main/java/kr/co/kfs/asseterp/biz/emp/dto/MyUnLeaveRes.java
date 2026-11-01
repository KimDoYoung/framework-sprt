package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y03 연월차휴가 지정통보 그리드 한 행 (AS-IS Emp21_UnLeaveModel 중 Emp21_Tab_PersonList가 쓰는 열) */
public record MyUnLeaveRes(
        Long unLeaveId,
        Long personId,
        String unLeaveCode,
        String unLeaveName,
        LocalDate startDate,
        Double remainDays,
        Long apprId,
        String apprStatusName,
        Long expectApprId,
        String expectApprStatusCode,
        String expectApprStatusName
) {
}
