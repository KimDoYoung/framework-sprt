package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** 근태관리(관리자) 그리드 한 행 (AS-IS att02_commute.selectByTextAdmin · Att02_CommuteModel). checkInTime·checkOutTime은 날짜 부분만 */
public record AttCommuteRes(Long commuteId, Long personId, LocalDate workDate, String statusCode, String statusName, String division,
                            String inOutReasonYnStr, String personNo, String personName, String orgName, String posName,
                            String dayOfWeek, String dateInfo, LocalDate checkInTime, String checkInTimeStr,
                            LocalDate checkOutTime, String checkOutTimeStr, String workTimeStr,
                            String calcCheckInTimeStr, String calcCheckOutTimeStr, String calcWorkTimeStr,
                            String inReason, String outReason) {
}
