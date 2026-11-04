package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 로그인 사원 본인의 출퇴근 한 건 (AS-IS Att02_Commute.getLastInfo·selectByDate → Att02_CommuteModel 일부) */
public record AttMyCommuteRes(Long commuteId, Long personId, LocalDate workDate, String statusCode, String statusName,
                              LocalDateTime checkInTime, String checkInTimeStr, LocalDateTime checkOutTime,
                              String checkOutTimeStr, String inReason, String outReason) {
}
