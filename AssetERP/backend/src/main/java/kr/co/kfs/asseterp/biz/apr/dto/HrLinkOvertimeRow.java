package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A74 연장근무 한 건 (AS-IS Att03_OvertimeReqModel 중 양식에 쓰는 값, V24) */
public record HrLinkOvertimeRow(LocalDate workDate, String workTypeName, String overTimeStr, Long overtimeMin, String reason, String workRewardTypeName) {
}
