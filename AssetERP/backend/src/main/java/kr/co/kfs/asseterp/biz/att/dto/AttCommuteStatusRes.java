package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** AS-IS Att02_CommuteModel 중 근태현황(T08 getCommuteStatus · T09 getPersonStatus) 열. 한 쪽에 없는 열은 null */
public record AttCommuteStatusRes(Long commuteId, String personNo, String personName, String orgName, String posName,
                                  String statusName, LocalDate workDate, String dayOfWeek, String dateInfo,
                                  String inOutReasonYnStr, String inReason, String outReason,
                                  String checkInTimeStr, String checkOutTimeStr,
                                  String calcCheckInTimeStr, String calcCheckOutTimeStr,
                                  String baseWorkTimeStr, String overtimeWorkTimeStr, String nightWorkTimeStr) {
}
