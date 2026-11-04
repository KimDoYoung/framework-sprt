package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** 연장근무신청 창 그리드 한 행 (AS-IS Att03_OvertimeReqModel 중 Att03_Lookup_OvertimeReq가 쓰는 값) */
public record AttMyOvertimeReqRes(Long overtimeReqId, LocalDate workDate, String workTypeCode, String workTypeName, Long overtimeMin,
                                  String overTimeStr, String reason, String workRewardTypeCode, String workRewardTypeName,
                                  Long apprId, String statusCode, String statusName) {
}
