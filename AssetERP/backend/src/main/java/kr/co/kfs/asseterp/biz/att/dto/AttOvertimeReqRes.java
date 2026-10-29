package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** AS-IS Att03_OvertimeReqModel (연장근무관리 그리드). confirmYn은 'true'/'false' 글자(그리드 확정 열) */
public record AttOvertimeReqRes(Long overtimeReqId, String confirmYn, LocalDate workDate, String personNo, String personName,
                                String orgName, String posName, String workTypeName, String overTimeStr, String reason,
                                String workRewardTypeName, String paymentTypeCode, String paymentTypeName,
                                String weekReport, String monthReport, String changeReason) {
}
